import React, { useState } from 'react'
import {
  Box,
  VStack,
  Input,
  Button,
  Alert,
  AlertIcon,
  Progress,
  Text,
  HStack,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setMessage('')
      } else {
        setMessage('Please select a PDF, TXT, or DOCX file')
        setMessageType('error')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file && !url) {
      setMessage('Please select a file or enter a URL')
      setMessageType('error')
      return
    }

    if (url && !isValidUrl(url)) {
      setMessage('Please enter a valid URL')
      setMessageType('error')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setMessage('')

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const uploadData = {
        id: Date.now().toString(),
        filename: file ? file.name : new URL(url).pathname.split('/').pop() || 'webpage',
        url: url || `mock-url-${file.name}`,
        uploadedBy: 'admin@example.com',
        timestamp: new Date().toISOString()
      }

      setUploadProgress(100)
      onUpload(uploadData)
      
      setMessage(file ? 'File uploaded successfully' : 'URL added successfully')
      setMessageType('success')
      setFile(null)
      setUrl('')
      
      // Reset form
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      setMessage('Upload failed. Please try again.')
      setMessageType('error')
    } finally {
      setIsUploading(false)
      setTimeout(() => {
        setUploadProgress(0)
        setMessage('')
      }, 3000)
    }
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <MotionBox
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Upload Document or Add URL
        </Text>
        
        {message && (
          <Alert status={messageType} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
        
        <VStack spacing={3} align="stretch">
          <Box>
            <Text fontSize="sm" mb={2} color="gray.600">
              Upload File (PDF, TXT, DOCX)
            </Text>
            <Input
              id="file-input"
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
              size="md"
              p={1}
              border="2px dashed"
              borderColor={file ? 'green.300' : 'gray.300'}
              _hover={{ borderColor: 'brand.500' }}
              disabled={isUploading}
            />
          </Box>
          
          <Text textAlign="center" color="gray.500" fontSize="sm">
            OR
          </Text>
          
          <Box>
            <Text fontSize="sm" mb={2} color="gray.600">
              Add URL
            </Text>
            <Input
              type="url"
              placeholder="Enter a URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="md"
              focusBorderColor="brand.500"
              disabled={isUploading}
            />
          </Box>
        </VStack>
        
        {isUploading && (
          <Box>
            <Progress value={uploadProgress} colorScheme="blue" size="md" />
            <Text fontSize="sm" color="gray.500" mt={1}>
              Uploading... {uploadProgress}%
            </Text>
          </Box>
        )}
        
        <HStack justify="flex-end">
          <MotionButton
            colorScheme="green"
            size="md"
            onClick={handleUpload}
            isDisabled={(!file && !url) || isUploading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? <Spinner size="sm" /> : 'Upload'}
          </MotionButton>
        </HStack>
      </VStack>
    </MotionBox>
  )
}

export default UploadForm