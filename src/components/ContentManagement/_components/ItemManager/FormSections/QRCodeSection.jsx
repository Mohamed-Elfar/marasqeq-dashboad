import React from 'react'
import { Form } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'

const QRCodeSection = ({ formData, onFormChange }) => {
  return (
    <div>
      <Form.Group controlId="qrCodeImage">
        <Form.Label>QR Code Image</Form.Label>
        <ImageUploader
          currentImage={formData.qrCode}
          onUpload={url => onFormChange({ ...formData, qrCode: url })}
        />
        <Form.Text className="text-muted">
          You can generate a QR code for your social media link and upload or paste the image URL here.
        </Form.Text>
      </Form.Group>
    </div>
  )
}

export default QRCodeSection
