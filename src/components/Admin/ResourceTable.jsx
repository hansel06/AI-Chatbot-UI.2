import { FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiMove } from 'react-icons/fi'
import React, { useState, useMemo } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Link,
  Badge
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const MotionBox = motion(Box)
const MotionTr = motion(Tr)

const ResourceTable = ({ resources, onDeleteResource, onReorderResources }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResource, setSelectedResource] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const itemsPerPage = 10
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const filteredResources = useMemo(() => {
    return resources.filter(resource =>
      (resource.filename?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (resource.url?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    )
  }, [resources, searchTerm])

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredResources.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredResources, currentPage])

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage)

  const handleDelete = (resource) => {
    setSelectedResource(resource)
    onOpen()
  }

  const confirmDelete = () => {
    if (selectedResource) {
      onDeleteResource(selectedResource.id)
      setSelectedResource(null)
    }
    onClose()
  }

  const handleView = (resource) => {
    if (resource.type === 'pdf' && resource.fileUrl) {
      window.open(resource.fileUrl, '_blank')
    } else if (resource.type === 'url' && resource.url) {
      window.open(resource.url, '_blank')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
  }

  const getFileType = (resource) => {
    if (resource.type === 'url') {
      return { extension: 'URL', color: 'blue' }
    }
    const extension = resource.filename?.split('.').pop()?.toLowerCase() || 'UNKNOWN'
    const colorMap = {
      pdf: 'red',
      txt: 'blue',
      docx: 'green'
    }
    return { extension: extension.toUpperCase(), color: colorMap[extension] || 'gray' }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const reorderedResources = Array.from(resources)
    const [movedResource] = reorderedResources.splice(result.source.index, 1)
    reorderedResources.splice(result.destination.index, 0, movedResource)

    onReorderResources(reorderedResources)
  }

  return (
    <>
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
        <HStack justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Uploaded Resources
          </Text>
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="300px"
            size="md"
            focusBorderColor="brand.500"
          />
        </HStack>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="resources">
            {(provided) => (
              <Box overflowX="auto" {...provided.droppableProps} ref={provided.innerRef}>
                <Table variant="striped" size="md">
                  <Thead>
                    <Tr>
                      <Th>Drag</Th>
                      <Th>PDF File</Th>
                      <Th>URL</Th>
                      <Th>Type</Th>
                      <Th>Upload Date</Th>
                      <Th>Uploaded By</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedResources.map((resource, index) => {
                      const fileType = getFileType(resource)
                      return (
                        <Draggable key={resource.id} draggableId={resource.id} index={index}>
                          {(provided) => (
                            <MotionTr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Td {...provided.dragHandleProps}>
                                <FiMove />
                              </Td>
                              <Td>
                                {resource.type === 'pdf' && resource.filename ? (
                                  <Link
                                    href={resource.fileUrl}
                                    color="brand.500"
                                    fontSize="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleView(resource)
                                    }}
                                    _hover={{ textDecoration: 'underline' }}
                                  >
                                    {resource.filename}
                                  </Link>
                                ) : (
                                  <Text fontSize="sm" color="gray.500">-</Text>
                                )}
                              </Td>
                              <Td>
                                {resource.type === 'url' && resource.url ? (
                                  <Link
                                    href={resource.url}
                                    color="brand.500"
                                    fontSize="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleView(resource)
                                    }}
                                    _hover={{ textDecoration: 'underline' }}
                                  >
                                    {resource.url}
                                  </Link>
                                ) : (
                                  <Text fontSize="sm" color="gray.500">-</Text>
                                )}
                              </Td>
                              <Td>
                                <Badge colorScheme={fileType.color} variant="subtle">
                                  {fileType.extension}
                                </Badge>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {formatDate(resource.timestamp)}
                                </Text>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {resource.uploadedBy}
                                </Text>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="View resource"
                                    icon={<FiEye />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleView(resource)}
                                    isDisabled={!resource.fileUrl && !resource.url}
                                  />
                                  <IconButton
                                    aria-label="Delete resource"
                                    icon={<FiTrash2 />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete(resource)}
                                  />
                                </HStack>
                              </Td>
                            </MotionTr>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        {filteredResources.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">
              {searchTerm ? 'No resources found matching your search.' : 'No resources uploaded yet.'}
            </Text>
          </Box>
        )}

        {totalPages > 1 && (
          <HStack justify="center" mt={6} spacing={2}>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
              size="sm"
            />
            <Text fontSize="sm">
              Page {currentPage} of {totalPages}
            </Text>
            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              isDisabled={currentPage === totalPages}
              size="sm"
            />
          </HStack>
        )}
      </MotionBox>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Resource
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{selectedResource?.filename || selectedResource?.url}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ResourceTable
