import React, { useState } from 'react'
import {
  Box,
  Textarea,
  Button,
  HStack,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionButton = motion(Button)

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, redact] = useState('')
  const bg = useColorModeValue('white', 'gray' + '.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      redact('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      p={4}
      bg={bg}
      borderTop="1px"
      borderColor={borderColor}
      zIndex={100}
    >
      <Box maxW="4xl" mx="auto">
        <HStack spacing={2}>
          <Textarea
            aria-label="Query input"
            placeholder="Ask a question about the documents..."
            value={message}
            onChange={(e) => redact(e.target.value)}
            onKeyPress={handleKeyPress}
            resize="vertical"
            maxH="150px"
            minH="40px"
            size="md"
            focusBorderColor="brand.500"
            flex={1}
          />
          <MotionButton
            aria-label="Send button"
            colorScheme="blue"
            size="md"
            onClick={handleSubmit}
            isDisabled={!message.trim() || isLoading}
            minW="80px"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <Spinner size="sm" /> : 'Send'}
          </MotionButton>
        </HStack>
      </Box>
    </Box>
  )
}

export default ChatInput