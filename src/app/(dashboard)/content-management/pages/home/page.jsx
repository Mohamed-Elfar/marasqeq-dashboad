'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import SiteSettingsEditor from '@/components/ContentManagement/SiteSettingsEditor';

const PropertyTypesToggle = () => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Showcase Section</h5>
        <small className="text-muted">Control visibility of Showcase section on homepage</small>
      </Card.Header>
      <Card.Body>
        <SiteSettingsEditor pageKey="home" fieldsOnly={['show_property_types']} />
      </Card.Body>
    </Card>
  );
};

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
              <SiteSettingsEditor pageKey="home" fieldsOnly={['home_video_url']} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <PropertyTypesToggle />
        </Col>
      </Row>
    </Container>
  );
}
