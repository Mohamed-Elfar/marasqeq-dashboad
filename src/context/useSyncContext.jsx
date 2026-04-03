'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { realtimeManager } from '@/lib/realtime'
import { websiteBridge } from '@/lib/website-bridge'

const SyncContext = createContext()

export const useSyncContext = () => {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider')
  }
  return context
}

export const SyncProvider = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState({
    connected: false,
    lastSync: null,
    pendingChanges: 0,
    tables: {}
  })

  const [subscriptions, setSubscriptions] = useState(new Map())

  // Initialize real-time subscriptions
  useEffect(() => {
    const tables = [
      'properties', 'categories', 'news', 'services', 'portfolio',
      'contact_info', 'form_options', 'social_links', 'pages'
    ]

    const newSubscriptions = new Map()

    // Subscribe to all tables
    tables.forEach(table => {
      const unsubscribe = realtimeManager.addListener(table, (payload) => {
        console.log(`Real-time update in ${table}:`, payload)
        
        // Update sync status
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          pendingChanges: prev.pendingChanges + 1,
          tables: {
            ...prev.tables,
            [table]: {
              ...prev.tables[table],
              lastUpdate: new Date().toISOString(),
              changeType: payload.eventType
            }
          }
        }))

        // Clear website cache for this table
        websiteBridge.clearCacheFor(`/api/${table === 'contact_info' ? 'contact-info' : table}`)

        // Notify website of changes (if website is open)
        notifyWebsiteOfChange(table, payload)
      })

      newSubscriptions.set(table, unsubscribe)
    })

    setSubscriptions(newSubscriptions)
    setSyncStatus(prev => ({
      ...prev,
      connected: true
    }))

    // Cleanup on unmount
    return () => {
      newSubscriptions.forEach(unsubscribe => unsubscribe())
      realtimeManager.unsubscribeAll()
    }
  }, [])

  // Notify website of changes
  const notifyWebsiteOfChange = async (table, payload) => {
    try {
      // This would typically use WebSocket or Server-Sent Events
      // For now, we'll just clear the cache so the website fetches fresh data
      console.log(`Notifying website of changes to ${table}`)
      
      // You could also trigger a webhook or push notification here
      if (typeof window !== 'undefined' && window.websiteWindow) {
        window.websiteWindow.postMessage({
          type: 'DATABASE_CHANGE',
          table,
          payload
        }, '*')
      }
    } catch (error) {
      console.error('Error notifying website:', error)
    }
  }

  // Manual sync trigger
  const triggerSync = async (table = null) => {
    try {
      if (table) {
        // Sync specific table
        await websiteBridge.syncData(table)
      } else {
        // Sync all tables
        const tables = [
          'properties', 'categories', 'news', 'services', 'portfolio',
          'contact_info', 'form_options', 'social_links', 'pages'
        ]
        
        await Promise.all(
          tables.map(t => websiteBridge.syncData(t))
        )
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        pendingChanges: 0
      }))

      return { success: true }
    } catch (error) {
      console.error('Manual sync failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Get sync status for specific table
  const getTableSyncStatus = (table) => {
    return syncStatus.tables[table] || {
      lastUpdate: null,
      changeType: null
    }
  }

  // Clear pending changes count
  const clearPendingChanges = () => {
    setSyncStatus(prev => ({
      ...prev,
      pendingChanges: 0
    }))
  }

  const value = {
    syncStatus,
    triggerSync,
    getTableSyncStatus,
    clearPendingChanges,
    isConnected: syncStatus.connected,
    lastSync: syncStatus.lastSync,
    pendingChanges: syncStatus.pendingChanges
  }

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  )
}
