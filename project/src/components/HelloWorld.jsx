import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Steps, Alert, Tabs, Typography, Image, Row, Col } from 'antd'
import { CameraOutlined, FileImageOutlined, BookOutlined, PlayCircleOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

function DrawingInstructionApp() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [drawingSteps, setDrawingSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Sample drawing tutorials for when camera is not available
  const sampleTutorials = [
    {
      title: "Simple Tree",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iNDAiIGZpbGw9ImdyZWVuIi8+PHJlY3QgeD0iOTUiIHk9IjEyMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYwIiBmaWxsPSJicm93biIvPjwvc3ZnPg==",
      steps: [
        "Start with a vertical line for the trunk",
        "Draw a large circle above the trunk for the tree crown",
        "Add texture lines to the trunk",
        "Create smaller circles within the crown for leaves",
        "Add shading to give the tree dimension",
        "Finish with ground details around the base"
      ]
    },
    {
      title: "Basic House",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZkNzAwIi8+PHBvbHlnb24gcG9pbnRzPSI1MCwxMDAgMTAwLDUwIDE1MCwxMDAiIGZpbGw9InJlZCIvPjxyZWN0IHg9IjkwIiB5PSIxMzAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI1MCIgZmlsbD0iYnJvd24iLz48L3N2Zz4=",
      steps: [
        "Draw a rectangle for the main structure",
        "Add a triangle on top for the roof",
        "Draw a smaller rectangle for the door",
        "Add square windows on either side",
        "Include a chimney on the roof",
        "Add details like door handle and window frames"
      ]
    },
    {
      title: "Cat Face",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSJncmF5Ii8+PGNpcmNsZSBjeD0iODUiIGN5PSI4NSIgcj0iNSIgZmlsbD0iYmxhY2siLz48Y2lyY2xlIGN4PSIxMTUiIGN5PSI4NSIgcj0iNSIgZmlsbD0iYmxhY2siLz48cG9seWdvbiBwb2ludHM9Ijc1LDcwIDg1LDUwIDk1LDcwIiBmaWxsPSJncmF5Ii8+PHBvbHlnb24gcG9pbnRzPSIxMDUsNzAgMTE1LDUwIDEyNSw3MCIgZmlsbD0iZ3JheSIvPjwvc3ZnPg==",
      steps: [
        "Start with a large circle for the head",
        "Add two triangular ears at the top",
        "Draw two small circles for the eyes",
        "Add a small triangle for the nose",
        "Draw curved lines for the mouth",
        "Add whiskers extending from the sides"
      ]
    }
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Camera access denied or not available. Please use the alternative tutorials below.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageDataUrl)
      analyzeImage()
      stopCamera()
    }
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    
    // Simulated analysis - in a real app, this would use an AI service
    setTimeout(() => {
      const genericSteps = [
        "Observe the overall shape and proportions of your subject",
        "Start with basic geometric shapes as your foundation",
        "Sketch light guidelines to establish the main structure",
        "Add the primary features and details",
        "Refine the outline and remove construction lines",
        "Add shading and texture to create depth",
        "Final touches and highlights to complete your drawing"
      ]
      
      setDrawingSteps(genericSteps)
      setCurrentStep(0)
      setIsAnalyzing(false)
    }, 2000)
  }

  const loadTutorial = (tutorial) => {
    setCapturedImage(tutorial.image)
    setDrawingSteps(tutorial.steps)
    setCurrentStep(0)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎨 Draw It Step-by-Step
          </Title>
          <Text className="text-lg text-gray-600">
            Take a photo of anything and get personalized drawing instructions!
          </Text>
        </div>

        <Tabs defaultActiveKey="camera" size="large" centered>
          <TabPane 
            tab={<><CameraOutlined /> Camera</>} 
            key="camera"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              {!cameraActive && !capturedImage && (
                <div className="text-center py-12">
                  <CameraOutlined className="text-6xl text-blue-500 mb-4" />
                  <Title level={3}>Capture Your Subject</Title>
                  <Paragraph className="text-gray-600 mb-6">
                    Take a photo of anything you'd like to learn to draw
                  </Paragraph>
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<CameraOutlined />}
                    onClick={startCamera}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start Camera
                  </Button>
                </div>
              )}
              
              {cameraActive && (
                <div className="text-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full max-w-md mx-auto rounded-lg shadow-md mb-4"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<CameraOutlined />}
                      onClick={capturePhoto}
                      className="mr-4 bg-green-500 hover:bg-green-600"
                    >
                      Capture Photo
                    </Button>
                    <Button 
                      size="large" 
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Title level={4}>Your Photo</Title>
                    <Image 
                      src={capturedImage} 
                      alt="Captured subject" 
                      className="rounded-lg shadow-md"
                      style={{ maxHeight: '300px' }}
                    />
                    <div className="mt-4">
                      <Button 
                        onClick={() => {
                          setCapturedImage(null)
                          setDrawingSteps([])
                          setCurrentStep(0)
                        }}
                      >
                        Take Another Photo
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Title level={4}>Drawing Instructions</Title>
                    {isAnalyzing ? (
                      <Alert 
                        message="Analyzing your image..." 
                        description="Generating personalized drawing steps" 
                        type="info" 
                        showIcon 
                      />
                    ) : (
                      drawingSteps.length > 0 && (
                        <div>
                          <Steps 
                            direction="vertical" 
                            current={currentStep}
                            items={drawingSteps.map((step, index) => ({
                              title: `Step ${index + 1}`,
                              description: step
                            }))}
                          />
                          <div className="mt-6 flex gap-2">
                            <Button 
                              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                              disabled={currentStep === 0}
                            >
                              Previous
                            </Button>
                            <Button 
                              type="primary"
                              onClick={() => setCurrentStep(Math.min(drawingSteps.length - 1, currentStep + 1))}
                              disabled={currentStep === drawingSteps.length - 1}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane 
            tab={<><BookOutlined /> Tutorials</>} 
            key="tutorials"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Title level={3} className="text-center mb-6">Popular Drawing Tutorials</Title>
              <Row gutter={[16, 16]}>
                {sampleTutorials.map((tutorial, index) => (
                  <Col xs={24} md={8} key={index}>
                    <Card 
                      hoverable
                      cover={
                        <div className="h-48 flex items-center justify-center bg-gray-50">
                          <img 
                            src={tutorial.image} 
                            alt={tutorial.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      }
                      actions={[
                        <Button 
                          type="primary" 
                          icon={<PlayCircleOutlined />}
                          onClick={() => loadTutorial(tutorial)}
                          block
                        >
                          Start Tutorial
                        </Button>
                      ]}
                    >
                      <Card.Meta 
                        title={tutorial.title}
                        description={`${tutorial.steps.length} steps`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {capturedImage && drawingSteps.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <Title level={4}>Reference Image</Title>
                      <Image 
                        src={capturedImage} 
                        alt="Tutorial subject" 
                        className="rounded-lg"
                        style={{ maxHeight: '250px' }}
                      />
                    </div>
                    
                    <div>
                      <Title level={4}>Step-by-Step Guide</Title>
                      <Steps 
                        direction="vertical" 
                        current={currentStep}
                        size="small"
                        items={drawingSteps.map((step, index) => ({
                          title: `Step ${index + 1}`,
                          description: step
                        }))}
                      />
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="small"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                        >
                          Previous
                        </Button>
                        <Button 
                          type="primary"
                          size="small"
                          onClick={() => setCurrentStep(Math.min(drawingSteps.length - 1, currentStep + 1))}
                          disabled={currentStep === drawingSteps.length - 1}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane 
            tab={<><FileImageOutlined /> Tips</>} 
            key="tips"
          >
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Title level={3} className="text-center mb-6">Drawing Tips & Techniques</Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="📏 Getting Proportions Right" className="h-full">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Use your pencil as a measuring tool</li>
                      <li>• Start with basic shapes before adding details</li>
                      <li>• Compare sizes of different elements</li>
                      <li>• Step back frequently to check your work</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="✏️ Pencil Techniques" className="h-full">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Use light strokes for initial sketches</li>
                      <li>• Vary pressure for different line weights</li>
                      <li>• Practice hatching and cross-hatching</li>
                      <li>• Keep your pencil sharp for fine details</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="🌟 Shading & Texture" className="h-full">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Identify your light source first</li>
                      <li>• Use gradual transitions for smooth shading</li>
                      <li>• Practice different texture techniques</li>
                      <li>• Don't forget cast shadows</li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="🎯 Common Mistakes" className="h-full">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Starting with details instead of overall shape</li>
                      <li>• Making lines too dark too early</li>
                      <li>• Not observing negative spaces</li>
                      <li>• Rushing through the construction phase</li>
                    </ul>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default DrawingInstructionApp