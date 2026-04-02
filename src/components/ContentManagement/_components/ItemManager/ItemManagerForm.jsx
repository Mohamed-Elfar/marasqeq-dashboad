import React from 'react'
import { Form } from 'react-bootstrap'
import BasicInfoSection from './FormSections/BasicInfoSection'
import CategorySection from './FormSections/CategorySection'
import MediaSection from './FormSections/MediaSection'
import SpecificDetailsSection from './FormSections/SpecificDetailsSection'
import AuthorSection from './FormSections/AuthorSection'
import SettingsSection from './FormSections/SettingsSection'

const ItemManagerForm = ({ formData, itemType, categories, onFormChange, section }) => {
  const renderSection = () => {
    switch (section) {
      case 'basic':
        return <BasicInfoSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
      case 'category':
        return <CategorySection formData={formData} itemType={itemType} categories={categories} onFormChange={onFormChange} />
      case 'media':
        return <MediaSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
      case 'specific':
        return <SpecificDetailsSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
      case 'author':
        return <AuthorSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
      case 'settings':
        return <SettingsSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
      default:
        // If no section specified, render all (backward compatibility)
        return (
          <>
            <BasicInfoSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
            <CategorySection formData={formData} itemType={itemType} categories={categories} onFormChange={onFormChange} />
            <MediaSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
            <SpecificDetailsSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
            <AuthorSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
            <SettingsSection formData={formData} itemType={itemType} onFormChange={onFormChange} />
          </>
        )
    }
  }

  return <Form>{renderSection()}</Form>
}

export default ItemManagerForm
