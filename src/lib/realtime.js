import { supabase } from './supabase'
import { useState, useEffect } from 'react'

// Real-time subscription manager
class RealtimeManager {
  constructor() {
    this.subscriptions = new Map()
    this.listeners = new Map()
  }

  // Subscribe to table changes
  subscribe(table) {
    const channelName = `table-changes-${table}`

    // Clean up existing subscription
    if (this.subscriptions.has(table)) {
      this.subscriptions.get(table).unsubscribe()
    }

    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table
        },
        (payload) => {
          console.log(`Real-time change in ${table}:`, payload)

          // Notify all listeners for this table
          const tableListeners = this.listeners.get(table) || []
          tableListeners.forEach(listener => {
            try {
              listener(payload)
            } catch (error) {
              console.error(`Error in listener for ${table}:`, error)
            }
          })
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${table} changes`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${table}`)
        } else if (status === 'TIMED_OUT') {
          console.warn(`Subscription to ${table} timed out`)
        } else if (status === 'CLOSED') {
          console.log(`Subscription to ${table} closed`)
        }
      })

    this.subscriptions.set(table, subscription)
    return subscription
  }

  // Add event listener for a table
  addListener(table, callback) {
    if (!this.listeners.has(table)) {
      this.listeners.set(table, [])
    }

    const listeners = this.listeners.get(table)
    listeners.push(callback)

    // Start subscription if not already active
    if (!this.subscriptions.has(table)) {
      this.subscribe(table, callback)
    }

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }

      // Clean up subscription if no more listeners
      if (listeners.length === 0) {
        const subscription = this.subscriptions.get(table)
        if (subscription) {
          subscription.unsubscribe()
          this.subscriptions.delete(table)
        }
        this.listeners.delete(table)
      }
    }
  }

  // Unsubscribe from all tables
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, table) => {
      subscription.unsubscribe()
      console.log(`Unsubscribed from ${table}`)
    })

    this.subscriptions.clear()
    this.listeners.clear()
  }

  // Get subscription status
  getSubscriptionStatus(table) {
    const subscription = this.subscriptions.get(table)
    return subscription ? subscription.subscriptionStatus : null
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager()

// Helper functions for specific table subscriptions
export const subscribeToProperties = (callback) => {
  return realtimeManager.addListener('properties', callback)
}

export const subscribeToCategories = (callback) => {
  return realtimeManager.addListener('categories', callback)
}

export const subscribeToNews = (callback) => {
  return realtimeManager.addListener('news', callback)
}

export const subscribeToServices = (callback) => {
  return realtimeManager.addListener('services', callback)
}

export const subscribeToPortfolio = (callback) => {
  return realtimeManager.addListener('portfolio', callback)
}

export const subscribeToContactInfo = (callback) => {
  return realtimeManager.addListener('contact_info', callback)
}

export const subscribeToFormOptions = (callback) => {
  return realtimeManager.addListener('form_options', callback)
}

export const subscribeToSocialLinks = (callback) => {
  return realtimeManager.addListener('social_links', callback)
}

export const subscribeToPages = (callback) => {
  return realtimeManager.addListener('pages', callback)
}

// React hook for real-time subscriptions
export const useRealtimeSubscription = (table, callback) => {
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const unsubscribe = realtimeManager.addListener(table, callback)
    setSubscription(unsubscribe)

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [table, callback])

  return subscription
}
