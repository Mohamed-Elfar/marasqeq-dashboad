'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import SiteSettingsEditor from '@/components/ContentManagement/SiteSettingsEditor';

export default function HomePageEditor() {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Video Banner Settings</h5>
              <small className="text-muted">Configure home page video banner</small>
            </Card.Header>
            <Card.Body>
              <SiteSettingsEditor pageKey="home" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
