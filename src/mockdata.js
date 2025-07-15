export const mockUsers = [
  { id: '1', email: 'user@example.com', password: 'password', role: 'user' },
  { id: '2', email: 'admin@example.com', password: 'admin123', role: 'admin' }
]

export const mockChatHistory = [
  {
    id: '1',
    query: 'What is the main topic of document 1?',
    response: 'The main topic of document 1 is artificial intelligence and machine learning applications in healthcare.',
    sources: ['doc1.pdf', 'healthcare-ai.docx'],
    timestamp: '2025-07-15T10:30:00Z'
  },
  {
    id: '2',
    query: 'How does the system work?',
    response: 'The system uses natural language processing to understand queries and retrieves relevant information from uploaded documents.',
    sources: ['system-overview.pdf'],
    timestamp: '2025-07-15T11:15:00Z'
  }
]

export const mockResources = [
  {
    id: '1',
    filename: 'doc1.pdf',
    url: 'https://example.com/doc1.pdf',
    uploadedBy: 'admin@example.com',
    timestamp: '2025-07-15T09:00:00Z'
  },
  {
    id: '2',
    filename: 'healthcare-ai.docx',
    url: 'https://example.com/healthcare-ai.docx',
    uploadedBy: 'admin@example.com',
    timestamp: '2025-07-15T09:30:00Z'
  }
]

export const mockStats = {
  documents: 25,
  queries: 100,
  storage: '500 MB'
}