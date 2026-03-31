'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, CardBody, CardHeader, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';

const SupportCenter = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load support messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter((msg) => msg.status === filter);
  }, [filter, messages]);

  const updateMessageStatus = async (id, status) => {
    try {
      const response = await fetch('/api/content/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                status
              }
            : msg
        )
      );
    } catch (err) {
      setError('Failed to update message status');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col>
          <h3 className="mb-1">Support Center</h3>
          <p className="text-muted mb-0">Receive and manage website contact messages.</p>
        </Col>
        <Col md={4} className="text-md-end mt-2 mt-md-0">
          <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Messages</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </Form.Select>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Incoming Messages</h5>
          <Button size="sm" variant="outline-primary" onClick={fetchMessages}>
            Refresh
          </Button>
        </CardHeader>
        <CardBody>
          {filteredMessages.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No messages found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <div className="fw-semibold">{msg.name || 'Unknown'}</div>
                        <small className="text-muted">{msg.email || '-'}</small>
                      </td>
                      <td>{msg.subject || '-'}</td>
                      <td style={{ maxWidth: 340 }}>
                        <span className="text-muted">{msg.message || '-'}</span>
                      </td>
                      <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <Badge bg={msg.status === 'resolved' ? 'success' : 'warning'}>
                          {msg.status === 'resolved' ? 'Resolved' : 'Open'}
                        </Badge>
                      </td>
                      <td>
                        {msg.status === 'resolved' ? (
                          <Button size="sm" variant="outline-warning" onClick={() => updateMessageStatus(msg.id, 'open')}>
                            Re-open
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline-success" onClick={() => updateMessageStatus(msg.id, 'resolved')}>
                            Mark Resolved
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default SupportCenter;
