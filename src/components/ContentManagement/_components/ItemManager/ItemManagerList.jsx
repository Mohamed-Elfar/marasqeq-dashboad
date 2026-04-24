import React from 'react'
import { Card, Table, Button, Spinner } from 'react-bootstrap'
import SocialIcon from '../SocialIcon'

const formatPrice = (value) => {
  // Convert to string if not already a string
  const stringValue = String(value || '')
  
  // Remove all non-digit characters and dots
  let cleanValue = stringValue.replace(/[^0-9]/g, '')
  
  // If empty, return empty
  if (!cleanValue) return ''
  
  // Add dots as thousands separators (e.g., 2300100 becomes 2.300.100)
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const ItemManagerList = ({ items, loading, itemType, onEdit, onDelete }) => {
  const getItemFields = () => {
    switch (itemType) {
      case 'properties':
        return {
          columns: ['Title', 'Category', 'Price', 'Location', 'Date', 'Actions'],
          getRowData: (item) => {
            // Display category as-is from database
            let categoryDisplay = '';
            if (Array.isArray(item.category)) {
              categoryDisplay = item.category.join(', ');
            } else {
              categoryDisplay = item.category || '';
            }
            
            return [
              item.title,
              categoryDisplay,
              formatPrice(item.price),
              item.location,
              item.date,
              null, // Actions column
            ];
          },
        }
      case 'news':
        return {
          columns: ['Title', 'Category', 'Status', 'Visibility', 'Author', 'Date', 'Actions'],
          getRowData: (item) => [
            item.title,
            item.category,
            item.status,
            item.visibility,
            item.author?.name,
            item.date,
            null, // Actions column
          ],
        }
      case 'services':
        return {
          columns: ['Title', 'Category', 'Icon', 'Status', 'Featured', 'Actions'],
          getRowData: (item) => [
            item.title,
            Array.isArray(item.category) ? item.category.join(', ') : item.category,
            item.icon,
            item.active ? 'Active' : 'Inactive',
            item.featured ? 'Yes' : 'No',
            null, // Actions column
          ],
        }
      case 'portfolio':
        return {
          columns: ['Title', 'Designation', 'Category', 'Filter', 'Status', 'Actions'],
          getRowData: (item) => [
            item.title,
            item.designation,
            Array.isArray(item.category) ? item.category.join(', ') : item.category,
            item.filter,
            item.active ? 'Active' : 'Inactive',
            null, // Actions column
          ],
        }
      case 'faq':
        return {
          columns: ['Question', 'Category', 'Order', 'Status', 'Actions'],
          getRowData: (item) => [
            item.question,
            item.category,
            item.order || 1,
            item.active ? 'Active' : 'Inactive',
            null, // Actions column
          ],
        }
      case 'social':
        return {
          columns: ['Name', 'Icon', 'Position', 'Order', 'Status', 'Actions'],
          getRowData: (item) => [
            item.name,
            <SocialIcon key={`icon-${item.id}`} icon={item.icon} className="text-primary" />,
            Array.isArray(item.position) 
              ? item.position.join(', ').charAt(0).toUpperCase() + item.position.join(', ').slice(1)
              : item.position,
            item.order || 1,
            item.active ? 'Active' : 'Inactive',
            null, // Actions column
          ],
        }
      default:
        return {
          columns: ['Title', 'Category', 'Actions'],
          getRowData: (item) => [
            item.title,
            item.category,
            null, // Actions column
          ],
        }
    }
  }

  const { columns, getRowData } = getItemFields()

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <Card>
      <Card.Body>
        {items.length === 0 ? (
          <p className="text-muted text-center py-4">No items yet. Add one to get started!</p>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const rowData = getRowData(item)
                  return (
                    <tr key={item.id}>
                      {rowData.map((data, index) => (
                        <td key={index}>
                          {index === rowData.length - 1 ? (
                            // Actions column
                            <>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(item)}>
                                Edit
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
                                Delete
                              </Button>
                            </>
                          ) : (
                            // Regular data column
                            data || '-'
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ItemManagerList
