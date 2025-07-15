import React, { useState } from 'react'
import { Box, Heading, VStack } from '@chakra-ui/react'
import ResourceTable from '../components/Admin/ResourceTable'
import UploadForm from '../components/Admin/UploadForm'
import { mockResources } from '../mockData'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Admin = () => {
  const [resources, setResources] = useState(mockResources)

  const handleUpload = (resource) => {
    setResources([...resources, resource])
  }

  const handleDeleteResource = (id) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  return (
    <MotionBox
      p={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={6} align="stretch">
        <Heading>Admin Dashboard</Heading>
        <UploadForm onUpload={handleUpload} />
        <ResourceTable resources={resources} onDeleteResource={handleDeleteResource} />
      </VStack>
    </MotionBox>
  )
}

export default Admin