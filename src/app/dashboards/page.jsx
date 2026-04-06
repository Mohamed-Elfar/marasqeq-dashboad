'use client';

import React from 'react';
import Link from 'next/link';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';

const page = () => {
  return <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Dashboard</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Maraseq</Link>
              </li>
              <div className="mx-1" style={{
              height: 24,
              paddingRight: '8px'
            }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Manage Properties & News</h5>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-3">Add, edit, and remove property and news entries with images, videos, and details.</p>
              <div className="d-flex gap-2">
                <Link href="/content-management/properties" className="btn btn-outline-primary btn-sm">Properties</Link>
                <Link href="/content-management/news" className="btn btn-outline-primary btn-sm">News</Link>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Support Center</h5>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-3">Review contact messages from website users and mark them as open or resolved.</p>
              <Link href="/content-management/support-center" className="btn btn-outline-primary btn-sm">Open Support Center</Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>;
};
export default page;