'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';
import SiteSettingsEditor from '@/components/ContentManagement/SiteSettingsEditor';

const StatisticsToggle = () => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Statistics Section</h5>
        <small className="text-muted">Control visibility of Statistics section on homepage</small>
      </Card.Header>
      <Card.Body>
        <SiteSettingsEditor pageKey="home" fieldsOnly={['show_statistics']} />
      </Card.Body>
    </Card>
  );
};

export default function TermsConditionsPage() {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={12}>
          <SiteSettingsEditor pageKey="terms" />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <StatisticsToggle />
        </Col>
      </Row>
    </Container>
  );
}
