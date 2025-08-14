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
      title: "Realistic Tree",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idHJ1bmtHcmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjOEI0NTEzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjQTY2RTJFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzY4MzQxQSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ibGVhdkdyYWRpZW50IiBjeD0iMC4zIiBjeT0iMC4zIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzlCQzUzRCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzY4QTAyNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0RTc1MUIiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIEJhc2UvZ3JvdW5kIC0tPgogIDxlbGxpcHNlIGN4PSIxNTAiIGN5PSIyODAiIHJ4PSI4MCIgcnk9IjE1IiBmaWxsPSIjMzQ0MDMyIiBvcGFjaXR5PSIwLjMiLz4KICAKICA8IS0tIE1haW4gdHJ1bmsgLS0+CiAgPHBhdGggZD0iTTEzNSwyODAgTDE0MCwyMDAgUTE0NSwyMDAgMTUwLDE5NSBRMTU1LDIwMCAxNjAsMjAwIEwxNjUsMjgwIFoiIGZpbGw9InVybCgjdHJ1bmtHcmFkaWVudCkiLz4KICA8IS0tIEJhcmsgdGV4dHVyZSBsaW5lcyAtLT4KICA8cGF0aCBkPSJNMTM4LDI2MCBMIDE0MiwyNjUgTDEzOSwyNzAiIHN0cm9rZT0iIzZBMzIxOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNMTU3LDI0MCBMIDE2MSwyNDUgTDU5LDI1MCIgc3Ryb2tlPSIjNkEzMjE4IiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgogIAogIDwhLS0gTWFpbiBjcm93biAtLT4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iMTMwIiByeD0iNzAiIHJ5PSI2NSIgZmlsbD0idXJsKCNsZWF2ZUdyYWRpZW50KSIvPgogIAogIDwhLS0gQWRkaXRpb25hbCBmb2xpYWdlIGNsdXN0ZXJzIC0tPgogIDxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxNDAiIHJ4PSI0NSIgcnk9IjQwIiBmaWxsPSJ1cmwoI2xlYXZlR3JhZGllbnQpIiBvcGFjaXR5PSIwLjgiLz4KICA8ZWxsaXBzZSBjeD0iMjAwIiBjeT0iMTM1IiByeD0iNDAiIHJ5PSI0NSIgZmlsbD0idXJsKCNsZWF2ZUdyYWRpZW50KSIgb3BhY2l0eT0iMC44Ii8+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjkwIiByeD0iMzUiIHJ5PSIzMCIgZmlsbD0idXJsKCNsZWF2ZUdyYWRpZW50KSIgb3BhY2l0eT0iMC45Ii8+CiAgCiAgPCEtLSBTbWFsbCBicmFuY2hlcyAtLT4KICA8bGluZSB4MT0iMTQ1IiB5MT0iMjAwIiB4Mj0iMTIwIiB5Mj0iMTkwIiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iMyIvPgogIDxsaW5lIHgxPSIxNTUiIHkxPSIyMDUiIHgyPSIxODAiIHkyPSIxOTUiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgCiAgPCEtLSBMZWF2ZSBkZXRhaWxzIC0tPgogIDxjaXJjbGUgY3g9IjEyMCIgY3k9IjExMCIgcj0iNCIgZmlsbD0iIzlCQzUzRCIgb3BhY2l0eT0iMC42Ii8+CiAgPGNpcmNsZSBjeD0iMTcwIiBjeT0iMTIwIiByPSIzIiBmaWxsPSIjOUJDNTNEIiBvcGFjaXR5PSIwLjYiLz4KICA8Y2lyY2xlIGN4PSIxNDAiIGN5PSI4MCIgcj0iMyIgZmlsbD0iIzlCQzUzRCIgb3BhY2l0eT0iMC42Ii8+Cjwvc3ZnPg==",
      steps: [
        "Observe the overall silhouette and establish basic proportions using light guidelines",
        "Start with the trunk using vertical construction lines, noting how it tapers toward the top",
        "Add the main canopy shape using broad, overlapping oval forms to create natural asymmetry",
        "Develop the trunk with realistic bark texture using vertical and diagonal hatching lines",
        "Build up foliage mass with layered clusters, varying sizes to create depth and dimension",
        "Add major branches visible through the leaves, showing how they connect and support the canopy",
        "Create realistic leaf textures using directional strokes that follow the growth patterns",
        "Apply light and shadow to establish the primary light source and create three-dimensional form",
        "Add fine details like individual leaves at the edges and varied bark patterns",
        "Finish with environmental elements like ground shadows and atmospheric perspective"
      ]
    },
    {
      title: "Architectural House",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0id2FsbEdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMC4zIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y1RjVEQyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI0VERURDNCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNEREREQjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InJvb2ZHcmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMC41IiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNCNzQxMzQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNBMDM0MjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOEEyRTIxIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBCYXNlL2dyb3VuZCAtLT4KICA8cmVjdCB4PSI0MCIgeT0iMjYwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMzQ0MDMyIiBvcGFjaXR5PSIwLjMiLz4KCiAgPCEtLSBNYWluIGhvdXNlIHN0cnVjdHVyZSAtLT4KICA8cmVjdCB4PSI3MCIgeT0iMTYwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCN3YWxsR3JhZGllbnQpIiBzdHJva2U9IiNDQ0NDQUIiIHN0cm9rZS13aWR0aD0iMSIvPgoKICA8IS0tIFJvb2Ygd2l0aCBkZXB0aCAtLT4KICA8cG9seWdvbiBwb2ludHM9IjUwLDE2MCA3MCwxNjAgMTUwLDkwIDIzMCwxNjAgMjUwLDE2MCAyNjAsMTcwIDI1MCwxNzAgMjMwLDE3MCAyMzAsMTY1IDE1MCwxMDAgNzAsMTY1IDcwLDE3MCA2MCwxNzAgNTAsMTYwIiBmaWxsPSJ1cmwoI3Jvb2ZHcmFkaWVudCkiIHN0cm9rZT0iIzhBMkUyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KCiAgPCEtLSBSb29mIHRpbGVzIC0tPgogIDxnIHN0cm9rZT0iIzhBMkUyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiPgogICAgPGxpbmUgeDE9IjgwIiB5MT0iMTUwIiB4Mj0iMjIwIiB5Mj0iMTUwIi8+CiAgICA8bGluZSB4MT0iOTAiIHkxPSIxNDAiIHgyPSIyMTAiIHkyPSIxNDAiLz4KICAgIDxsaW5lIHgxPSIxMDAiIHkxPSIxMzAiIHgyPSIyMDAiIHkyPSIxMzAiLz4KICAgIDxsaW5lIHgxPSIxMTAiIHkxPSIxMjAiIHgyPSIxOTAiIHkyPSIxMjAiLz4KICA8L2c+CgogIDwhLS0gRnJvbnQgZG9vciAtLT4KICA8cmVjdCB4PSIxMzAiIHk9IjIwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjgzNDFBIiBzdHJva2U9IiM1QjI5MTQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxjaXJjbGUgY3g9IjE2NSIgY3k9IjIzMCIgcj0iMiIgZmlsbD0iI0ZGRDcwMCIvPgoKICA8IS0tIFdpbmRvd3MgLS0+CiAgPHJlY3QgeD0iODUiIHk9IjE4MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjODdDRUVCIiBzdHJva2U9IiMzNDQwMzIiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxyZWN0IHg9IjE4NSIgeT0iMTgwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiM4N0NFRUIiIHN0cm9rZT0iIzM0NDAzMiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgCiAgPCEtLSBXaW5kb3cgZGl2aWRlcnMgLS0+CiAgPGxpbmUgeDE9IjEwMCIgeTE9IjE4MCIgeDI9IjEwMCIgeTI9IjIxMCIgc3Ryb2tlPSIjMzQ0MDMyIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8bGluZSB4MT0iODUiIHkxPSIxOTUiIHgyPSIxMTUiIHkyPSIxOTUiIHN0cm9rZT0iIzM0NDAzMiIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPGxpbmUgeDE9IjIwMCIgeTE9IjE4MCIgeDI9IjIwMCIgeTI9IjIxMCIgc3Ryb2tlPSIjMzQ0MDMyIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8bGluZSB4MT0iMTg1IiB5MT0iMTk1IiB4Mj0iMjE1IiB5Mj0iMTk1IiBzdHJva2U9IiMzNDQwMzIiIHN0cm9rZS13aWR0aD0iMSIvPgoKICA8IS0tIENoaW1uZXkgLS0+CiAgPHJlY3QgeD0iMTgwIiB5PSI3MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjQjc0MTM0IiBzdHJva2U9IiNBMDM0MjgiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxyZWN0IHg9IjE3NSIgeT0iNjUiIHdpZHRoPSIzMCIgaGVpZ2h0PSI4IiBmaWxsPSIjQTA0MjM4Ii8+CiAgCiAgPCEtLSBTaGFkb3dzIGFuZCBkZXB0aCAtLT4KICA8cmVjdCB4PSIyMzAiIHk9IjE2NSIgd2lkdGg9IjMwIiBoZWlnaHQ9Ijk1IiBmaWxsPSIjQ0NDQ0FCIiBvcGFjaXR5PSIwLjciLz4KICA8cG9seWdvbiBwb2ludHM9IjI1MCwxNjUgMjYwLDE3MCAyNjAsMjYwIDI1MCwyNTUiIGZpbGw9IiNCQkJCQUEiIG9wYWNpdHk9IjAuNyIvPgo8L3N2Zz4=",
      steps: [
        "Study the architectural elements and establish perspective guidelines for accurate proportions",
        "Construct the basic box form of the house using proper perspective principles",
        "Add the roof structure, paying attention to angles and how they create depth",
        "Develop the front facade with proper door and window proportions and placement",
        "Create realistic window details including frames, mullions, and glass reflections",
        "Add architectural features like the chimney, ensuring it follows the perspective",
        "Develop surface textures - brick patterns, roof tiles, wood grain on the door",
        "Apply directional lighting to create consistent shadows and dimensional form",
        "Add environmental context like landscaping, pathways, and background elements",
        "Refine with final details: hardware, weathering, and atmospheric perspective"
      ]
    },
    {
      title: "Portrait Cat",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZnVyR3JhZGllbnQiIGN4PSIwLjMiIGN5PSIwLjMiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjVGNUY1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNDAlIiBzdG9wLWNvbG9yPSIjRDBEMEQwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjQTBBMEEwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzcwNzA3MCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZXllR3JhZGllbnQiIGN4PSIwLjMiIGN5PSIwLjMiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNDY5NEVFIS8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMjU2M0VCIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFENERENiIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibm9zZUdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkI2QzEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNGRjkxQTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRUM3QzY0Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBIZWFkIGJhc2Ugc2hhcGUgLS0+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE2MCIgcng9Ijc4IiByeT0iNzIiIGZpbGw9InVybCgjZnVyR3JhZGllbnQpIi8+CiAgCiAgPCEtLSBFYXIgc2hhcGVzIC0tPgogIDxwYXRoIGQ9Ik0gOTAsMTEwIFEgODUsNzAgMTEwLDkwIFEgMTIwLDEwNSAxMTAsMTI1IFoiIGZpbGw9InVybCgjZnVyR3JhZGllbnQpIi8+CiAgPHBhdGggZD0iTSAyMTAsMTEwIFEgMjE1LDcwIDE5MCw5MCBRIDE4MCwxMDUgMTkwLDEyNSBaIiBmaWxsPSJ1cmwoI2Z1ckdyYWRpZW50KSIvPgogIAogIDwhLS0gRWFyIGlubmVycyAtLT4KICA8cGF0aCBkPSJNIDk4LDEwNSBRIDk1LDkwIDEwNSw5NSBRIDEA4LDEwNSAxMDMsMTE1IFoiIGZpbGw9IiNGRkI2QzEiIG9wYWNpdHk9IjAuNyIvPgogIDxwYXRoIGQ9Ik0gMjAyLDEwNSBRIDIwNSw5MCAxOTUsOTUgUSAxODUsMTA1IDE5NywxMTUgWiIgZmlsbD0iI0ZGQjZDMSIgb3BhY2l0eT0iMC43Ii8+CgogIDwhLS0gRmFjaWFsIG1hcmtpbmdzIC0tPgogIDxlbGxpcHNlIGN4PSIxMTUiIGN5PSIxNDAiIHJ4PSIxNSIgcnk9IjEwIiBmaWxsPSIjNDA0MDQwIiBvcGFjaXR5PSIwLjMiLz4KICA8ZWxsaXBzZSBjeD0iMTg1IiBjeT0iMTQwIiByeD0iMTUiIHJ5PSIxMCIgZmlsbD0iIzQwNDA0MCIgb3BhY2l0eT0iMC4zIi8+CgogIDwhLS0gRXllcyAtLT4KICA8ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTQ1IiByeD0iMTgiIHJ5PSIyMiIgZmlsbD0idXJsKCNleWVHcmFkaWVudCkiLz4KICA8ZWxsaXBzZSBjeD0iMTgwIiBjeT0iMTQ1IiByeD0iMTgiIHJ5PSIyMiIgZmlsbD0idXJsKCNleWVHcmFkaWVudCkiLz4KICA8IS0tIFB1cGlscyAtLT4KICA8ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTQ1IiByeD0iNiIgcnk9IjEyIiBmaWxsPSIjMDAwMDAwIi8+CiAgPGVsbGlwc2UgY3g9IjE4MCIgY3k9IjE0NSIgcng9IjYiIHJ5PSIxMiIgZmlsbD0iIzAwMDAwMCIvPgogIDwhLS0gRXllIGhpZ2hsaWdodHMgLS0+CiAgPGVsbGlwc2UgY3g9IjEyMyIgY3k9IjE0MCIgcng9IjMiIHJ5PSI0IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjgiLz4KICA8ZWxsaXBzZSBjeD0iMTgzIiBjeT0iMTQwIiByeD0iMyIgcnk9IjQiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgoKICA8IS0tIE5vc2UgLS0+CiAgPHBhdGggZD0iTSAxNDUsMTcwIFEgMTUwLDE2NSAxNTUsMTcwIFEgMTUwLDE3OCAxNDUsMTcwIFoiIGZpbGw9InVybCgjbm9zZUdyYWRpZW50KSIvPgoKICA8IS0tIE1vdXRoIGFuZCBjaGluIC0tPgogIDxwYXRoIGQ9Ik0gMTUwLDE3OCBRIDEzNSwxODUgMTM1LDE5MCBRIDA1LDE5NSAxNTAsMTk1IFEgMTY1LDE5NSAxNjUsMTkwIFEgMTY1LDE4NSAxNTAsMTc4IiBzdHJva2U9IiMyMDIwMjAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgoKICA8IS0tIFdoaXNrZXJzIC0tPgogIDxsaW5lIHgxPSI1MCIgeTE9IjE2MCIgeDI9IjEwMCIgeTI9IjE1OCIgc3Ryb2tlPSIjMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDxsaW5lIHgxPSI2MCIgeTE9IjE3MCIgeDI9IjEwNSIgeTI9IjE2OCIgc3Ryb2tlPSIjMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDxsaW5lIHgxPSI1NSIgeTE9IjE4MCIgeDI9IjEwOCIgeTI9IjE3NiIgc3Ryb2tlPSIjMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIAogIDxsaW5lIHgxPSIyNTAiIHkxPSIxNjAiIHgyPSIyMDAiIHkyPSIxNTgiIHN0cm9rZT0iIzIwMjAyMCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8bGluZSB4MT0iMjQwIiB5MT0iMTcwIiB4Mj0iMTk1IiB5Mj0iMTY4IiBzdHJva2U9IiMyMDIwMjAiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgPGxpbmUgeDE9IjI0NSIgeTE9IjE4MCIgeDI9IjE5MiIgeTI9IjE3NiIgc3Ryb2tlPSIjMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIAogIDwhLS0gRnVyIHRleHR1cmUgaGludHMgLS0+CiAgPGcgc3Ryb2tlPSIjODA4MDgwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4zIiBmaWxsPSJub25lIj4KICAgIDxwYXRoIGQ9Ik0gMTA1LDEyNSBRIDExMCwxMzAgMTEzLDEzNSIvPgogICAgPHBhdGggZD0iTSAxOTUsMTI1IFFNOTE5MCwxMzAgMTg3LDEzNSIvPgogICAgPHBhdGggZD0iTSAxMzAsMjEwIFEgMTM1LDIxNSAxNDAsMjIwIi8+CiAgICA8cGF0aCBkPSJNIDE3MCwyMTAgUSAxNjUsMjE1IDE2MCwyMjAiLz4KICA8L2c+Cjwvc3ZnPg==",
      steps: [
        "Study feline anatomy and proportions, establishing the head's basic oval structure",
        "Map out facial feature placement using construction lines and anatomical landmarks",
        "Develop the distinctive ear shapes, considering both outer and inner ear structures",
        "Create realistic eyes with proper depth, including iris patterns and reflective highlights",
        "Sculpt the nose area with attention to the leather texture and surrounding fur patterns",
        "Build the mouth and chin area, understanding how fur grows around these features",
        "Add whiskers with natural curves and varying lengths to show dimension",
        "Develop fur texture using directional strokes that follow the natural growth patterns",
        "Apply realistic lighting to create form, considering how fur catches and diffuses light",
        "Complete with fine details: inner ear pinks, subtle color variations, and refined highlights"
      ]
    },
    {
      title: "Human Portrait",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ic2tpblRvbmUiIGN4PSIwLjMiIGN5PSIwLjIiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZEQkI2Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjRjJDMkE3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0U4QjA5MyIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iaGFpckdyYWRpZW50IiBjeD0iMC41IiBjeT0iMC4yIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzZENEMzMyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzVBM0EyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QjMxMUMiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImV5ZUdyYWRpZW50IiBjeD0iMC40IiBjeT0iMC4zIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzg4N0M2RiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iIzc2NkY1QiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1RTRFM0IiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIE5lY2sgLS0+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjI3MCIgcng9IjI1IiByeT0iMzUiIGZpbGw9InVybCgjc2tpblRvbmUpIiBvcGFjaXR5PSIwLjgiLz4KCiAgPCEtLSBGYWNlIGJhc2Ugc2hhcGUgLS0+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE3MCIgcng9IjY1IiByeT0iNzgiIGZpbGw9InVybCgjc2tpblRvbmUpIi8+CiAgCiAgPCEtLSBIYWlyIC0tPgogIDxwYXRoIGQ9Ik0gODUsMTMwIFEgODAsNzAgMTA1LDYwIFEgMTUwLDQwIDIyMCw5NCBRIDI1LDEyMCAxOTUsMTQ1IFEgMTgwLDE2NSAxNzAsMTUwIFEgMTYwLDE0MCAkNDAsMTMwIFEgMTIwLDEyNSAxMDUsMTM1IFEgOTAsMTQwIDg1LDEzMCBaIiBmaWxsPSJ1cmwoI2hhaXJHcmFkaWVudCkiLz4KCiAgPCEtLSBGb3JlaGVhZCBzaGFkb3cgLS0+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjEyNSIgcng9IjU1IiByeT0iMTUiIGZpbGw9IiNFNEEzODAiIG9wYWNpdHk9IjAuNCIvPgoKICA8IS0tIEV5ZWJyb3dzIC0tPgogIDxwYXRoIGQ9Ik0gMTEwLDEzNSBRIDEyNSwxMzAgMTM1LDEzNSIgc3Ryb2tlPSIjNEIzMTFDIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuOCIvPgogIDxwYXRoIGQ9Ik0gMTY1LDEzNSBRIDE3NSwxMzAgMTkwLDEzNSIgc3Ryb2tlPSIjNEIzMTFDIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuOCIvPgoKICA8IS0tIEV5ZXMgLS0+CiAgPGVsbGlwc2UgY3g9IjEyNSIgY3k9IjE1NSIgcng9IjE1IiByeT0iMTAiIGZpbGw9IiNGRkZGRkYiLz4KICA8ZWxsaXBzZSBjeD0iMTc1IiBjeT0iMTU1IiByeD0iMTUiIHJ5PSIxMCIgZmlsbD0iI0ZGRkZGRiIvPgogIDwhLS0gSXJpcyAtLT4KICA8Y2lyY2xlIGN4PSIxMjUiIGN5PSIxNTUiIHI9IjciIGZpbGw9InVybCgjZXllR3JhZGllbnQpIi8+CiAgPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTU1IiByPSI3IiBmaWxsPSJ1cmwoI2V5ZUdyYWRpZW50KSIvPgogIDwhLS0gUHVwaWxzIC0tPgogIDxjaXJjbGUgY3g9IjEyNSIgY3k9IjE1NSIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPgogIDxjaXJjbGUgY3g9IjE3NSIgY3k9IjE1NSIgcj0iMyIgZmlsbD0iIzAwMDAwMCIvPgogIDwhLS0gRXllIGhpZ2hsaWdodHMgLS0+CiAgPGVsbGlwc2UgY3g9IjEyNyIgY3k9IjE1MiIgcng9IjIiIHJ5PSIzIiBmaWxsPSIjRkZGRkZGIi8+CiAgPGVsbGlwc2UgY3g9IjE3NyIgY3k9IjE1MiIgcng9IjIiIHJ5PSIzIiBmaWxsPSIjRkZGRkZGIi8+CgogIDwhLS0gTm9zZSAtLT4KICA8cGF0aCBkPSJNIDE0NSwxNzUgUSAxNTAsMTY1IDE1NSwxNzUgUSAxNTIsMTg1IDE0OCwxODUgUSAxNDUsMTgyIDE0NSwxNzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q2OUU3RCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8IS0tIE5vc3RyaWxzIC0tPgogIDxlbGxpcHNlIGN4PSIxNDUiIGN5PSIxODAiIHJ4PSIyIiByeT0iMyIgZmlsbD0iI0M2OEU2RCIgb3BhY2l0eT0iMC41Ii8+CiAgPGVsbGlwc2UgY3g9IjE1NSIgY3k9IjE4MCIgcng9IjIiIHJ5PSIzIiBmaWxsPSIjQzY4RTZEIiBvcGFjaXR5PSIwLjUiLz4KCiAgPCEtLSBMaXBzIC0tPgogIDxwYXRoIGQ9Ik0gMTMwLDIwNSBRIDE1MCwxOTUgMTcwLDIwNSBRIDE1NSwyMTUgMTUwLDIxNSBRIDE0NSwyMTUgMTMwLDIwNSBaIiBmaWxsPSIjRDA3QjZEIiBvcGFjaXR5PSIwLjciLz4KICA8IS0tIExpcCBoaWdobGlnaHQgLS0+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjIwNSIgcng9IjgiIHJ5PSIzIiBmaWxsPSIjRjU5Qzk2IiBvcGFjaXR5PSIwLjgiLz4KCiAgPCEtLSBDaGVla2JvbmVzIGFuZCBmYWNlIHN0cnVjdHVyZSAtLT4KICA8ZWxsaXBzZSBjeD0iMTA1IiBjeT0iMTgwIiByeD0iMTAiIHJ5PSI4IiBmaWxsPSIjRjJBQzk2IiBvcGFjaXR5PSIwLjQiLz4KICA8ZWxsaXBzZSBjeD0iMTk1IiBjeT0iMTgwIiByeD0iMTAiIHJ5PSI4IiBmaWxsPSIjRjJBQzk2IiBvcGFjaXR5PSIwLjQiLz4KCiAgPCEtLSBKYXdsaW5lIC0tPgogIDxwYXRoIGQ9Ik0gMTAwLDIxMCBRIDEyNSwyMjUgMTUwLDIyNSBRIDE3NSwyMjUgMjAwLDIxMCIgc3Ryb2tlPSIjRDY5RTdEIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNiIvPgoKICA8IS0tIEVhcnMgLS0+CiAgPGVsbGlwc2UgY3g9IjkwIiBjeT0iMTY1IiByeD0iOCIgcnk9IjE4IiBmaWxsPSJ1cmwoI3NraW5Ub25lKSIgdHJhbnNmb3JtPSJyb3RhdGUoLTMwIDkwIDE2NSkiLz4KICA8ZWxsaXBzZSBjeD0iMjEwIiBjeT0iMTY1IiByeD0iOCIgcnk9IjE4IiBmaWxsPSJ1cmwoI3NraW5Ub25lKSIgdHJhbnNmb3JtPSJyb3RhdGUoMzAgMjEwIDE2NSkiLz4KPC9zdmc+",
      steps: [
        "Study human facial anatomy and proportions using the classic measurement guidelines",
        "Establish the head's basic form with construction lines for features placement",
        "Map the eye line, nose base, and mouth position using anatomical landmarks",
        "Develop the eye structure including lids, lashes, iris patterns, and tear ducts",
        "Construct the nose with attention to planes, nostrils, and bridge structure",
        "Shape the mouth considering lip forms, corners, and the surrounding muscle groups",
        "Build facial structure with cheekbones, jawline, and temporal areas",
        "Add hair with realistic growth patterns, volume, and directional flow",
        "Apply sophisticated lighting to show form, considering skin translucency and subsurface scattering",
        "Refine with skin texture, subtle color variations, and realistic details like pores and fine lines"
      ]
    },
    {
      title: "Landscape Scene",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ic2t5R3JhZGllbnQiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjQwJSIgc3RvcC1jb2xvcj0iI0I2RTVGOCIvPgogICAgICA <c3RvcCBvZmZzZXQ9IjgwJSIgc3RvcC1jb2xvcj0iI0Y5RkNGRiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibW91bnRhaW5HcmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNEY2MzgxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjNjM3N0E5Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzgwOTNEMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0idHJlZUdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIwLjUiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzZBOUMzRCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzQ5N0IyMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzNjYwMTUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYXNzR3JhZGllbnQiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzhCQzM0RCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjcwJSIgc3RvcC1jb2xvcj0iIzZBOTUyNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MjdEMTYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIFNreSAtLT4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNza3lHcmFkaWVudCkiLz4KCiAgPCEtLSBDbG91ZHMgLS0+CiAgPGVsbGlwc2UgY3g9IjYwIiBjeT0iNDAiIHJ4PSIyNSIgcnk9IjEyIiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjgiLz4KICA8ZWxsaXBzZSBjeD0iNzUiIGN5PSIzNSIgcng9IjIwIiByeT0iMTUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgogIDxlbGxpcHNlIGN4PSI0NSIgY3k9IjQ1IiByeD0iMTgiIHJ5PSI4IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjciLz4KCiAgPGVsbGlwc2UgY3g9IjIyMCIgY3k9IjUwIiByeD0iMzAiIHJ5PSIxNSIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjQ1IiByeD0iMjAiIHJ5PSIxMCIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC43Ii8+CgogIDwhLS0gRGlzdGFudCBtb3VudGFpbnMgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSIwLDE2MCA4MCwxMDAgMTQwLDEyMCAxODAsMTAwIDI0MCwxMzAgMzAwLDEyMCAzMDAsMTgwIDAsMTgwIiBmaWxsPSJ1cmwoI21vdW50YWluR3JhZGllbnQpIiBvcGFjaXR5PSIwLjciLz4KCiAgPCEtLSBNaWQtZ3JvdW5kIGhpbGxzIC0tPgogIDxwb2x5Z29uIHBvaW50cz0iMjAsMTgwIDEwMCwxNDAgMTgwLDE2MCAyNDAsMTQwIDMwMCwxNTUgMzAwLDE4MCAyMCwxODAiIGZpbGw9InVybCgjdHJlZUdyYWRpZW50KSIgb3BhY2l0eT0iMC41Ii8+CgogIDwhLS0gRm9yZWdyb3VuZCBncmFzcyAtLT4KICA8cmVjdCB4PSIwIiB5PSIxODAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI2dyYXNzR3JhZGllbnQpIi8+CgogIDwhLS0gVHJlZXMgLS0+CiAgPCEtLSBMZWZ0IHRyZWUgLS0+CiAgPHJlY3QgeD0iNzAiIHk9IjIwMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOEI0NTEzIi8+CiAgPGVsbGlwc2UgY3g9Ijc2IiBjeT0iMTg1IiByeD0iMjgiIHJ5PSIzNSIgZmlsbD0idXJsKCN0cmVlR3JhZGllbnQpIi8+CiAgCiAgPCEtLSBSaWdodCB0cmVlIC0tPgogIDxyZWN0IHg9IjIxMCIgeT0iMTkwIiB3aWR0aD0iMTUiIGhlaWdodD0iNTAiIGZpbGw9IiM4QjQ1MTMiLz4KICA8ZWxsaXBzZSBjeD0iMjE3IiBjeT0iMTcwIiByeD0iMzUiIHJ5PSI0MCIgZmlsbD0idXJsKCN0cmVlR3JhZGllbnQpIi8+CgogIDwhLS0gUmlsdmVyL3BhdGggLS0+CiAgPHBhdGggZD0iTSAwLDI1MCBRIDU5LDI0MCA5MCwyNDUgUSAxMjAsMjUwIDE1MiwyNDMgUSAxODAsMjM3IDIyMCwyNDIgUSAyNTAsMjQ3IDMwMCwyNDAiIHN0cm9rZT0iIzY5QjdGRiIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjciLz4KICA8IS0tIFJpdmVyIGJhbmtzIC0tPgogIDxwYXRoIGQ9Ik0gMCwyNDYgUSA1OCwyMzYgOTAsMjQxIFEgMTIwLDI0NiAxNTAsMjM5IFEgMTc4LDIzMyAyMjAsMjM4IFEgMjUwLDI0MyAzMDAsMjM2IiBzdHJva2U9IiM1Qjk0M0QiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0gMCwyNTQgUSA2MCwyNDQgOTAsMjQ5IFFFDI3OywyNTQgMTU0LDI0NyBRIDE4MiwyNDEgMjIwLDI0NiBRIDI1MCwyNTEgMzAwLDI0NCIgc3Ryb2tlPSIjNUI5NDNEIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz4KCiAgPCEtLSBHcmFzcyBkZXRhaWxzIC0tPgogIDxnIHN0cm9rZT0iIzQ5N0IyMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiPgogICAgPGxpbmUgeDE9IjQwIiB5MT0iMjkwIiB4Mj0iNDMiIHkyPSIyNzAiLz4KICAgIDxsaW5lIHgxPSI0NSIgeTE9IjI4NSIgeDI9IjQ4IiB5Mj0iMjcyIi8+CiAgICA8bGluZSB4MT0iNTIiIHkxPSIyOTIiIHgyPSI1NSIgeTI9IjI3NSIvPgogICAgPGxpbmUgeDE9IjI2MCIgeTE9IjI4MCIgeDI9IjI2MyIgeTI9IjI2OCIvPgogICAgPGxpbmUgeDE9IjI3MCIgeTE9IjI4OCIgeDI9IjI3MyIgeTI9IjI3MiIvPgogICAgPGxpbmUgeDE9IjI4MCIgeTE9IjI5NSIgeDI9IjI4MyIgeTI9IjI3OCIvPgogIDwvZz4KCiAgPCEtLSBGbG93ZXIgYWNjZW50cyAtLT4KICA8Y2lyY2xlIGN4PSIxMjAiIGN5PSIyNjAiIHI9IjMiIGZpbGw9IiNGRkQ3MDAiLz4KICA8Y2lyY2xlIGN4PSIxODAiIGN5PSIyNzAiIHI9IjIiIGZpbGw9IiNGRjY5QjQiLz4KICA8Y2lyY2xlIGN4PSIyNDAiIGN5PSIyNTUiIHI9IjIuNSIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=",
      steps: [
        "Study landscape composition and establish foreground, middle ground, and background divisions",
        "Create atmospheric perspective using value gradations from dark foreground to light background",
        "Begin with the sky using gradual color transitions and natural cloud formations",
        "Develop mountain forms with attention to geological structure and light patterns",
        "Add mid-ground elements like hills and distant trees using reduced contrast and detail",
        "Create foreground terrain with varied textures showing rocks, grass, and plant life",
        "Incorporate water elements understanding reflections, transparency, and movement patterns",
        "Build tree forms with realistic branching patterns and foliage mass distribution",
        "Apply consistent lighting throughout the scene showing time of day and weather conditions",
        "Complete with fine environmental details like varied grass textures and distant atmospheric effects"
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
      const realisticSteps = [
        "Study your subject carefully, analyzing its overall form, proportions, and relationship to surrounding elements",
        "Establish your light source and observe how it creates highlights, mid-tones, and shadow patterns across the form",
        "Begin with construction lines to map out basic proportions and major structural elements using light, confident strokes",
        "Block in the largest shapes first, working from general forms to specific details while maintaining proper proportional relationships",
        "Develop the mid-tone values, building up form gradually while paying attention to how planes turn in space",
        "Add surface textures and material qualities using directional strokes that follow the natural patterns of your subject",
        "Refine edge quality - determining which edges should be sharp, soft, or lost entirely to create realistic depth",
        "Establish your darkest darks and lightest lights, ensuring proper value contrast to create dimensional form",
        "Add subtle color temperature variations if working in color, noting how warm and cool areas interact",
        "Complete with final details and atmospheric effects, ensuring the entire drawing reads as a cohesive, realistic representation"
      ]
      
      setDrawingSteps(realisticSteps)
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