'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import SiteSettingsEditor from '@/components/ContentManagement/SiteSettingsEditor';

export default function ServicesPageEditor() {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Services Page Settings</h5>
              <small className="text-muted">Configure Services page content</small>
            </Card.Header>
            <Card.Body>
              <SiteSettingsEditor pageKey="services" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
