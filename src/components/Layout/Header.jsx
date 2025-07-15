import { FiSun, FiMoon } from 'react-icons/fi' // Replace SunIcon, MoonIcon
import React from 'react'
import {
  Flex,
  Text,
  IconButton,
  Button,
  useColorMode,
  useColorModeValue,
  Box,
  useBreakpointValue
} from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionFlex = motion(Flex)
const MotionIconButton = motion(IconButton)
const MotionButton = motion(Button)

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <MotionFlex
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      justify="space-between"
      align="center"
      shadow="sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text fontSize={isMobile ? "lg" : "xl"} fontWeight="bold" color="brand.500">
        AI Document Chat
      </Text>
      
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color="gray.500" display={{ base: 'none', md: 'block' }}>
          {user?.email}
        </Text>
        
        <MotionIconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          size="sm"
          variant="ghost"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        
        <MotionButton
          aria-label="Logout button"
          colorScheme="gray"
          size="sm"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </MotionButton>
      </Flex>
    </MotionFlex>
  )
}

export default Header