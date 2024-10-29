import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    Slider,
    Card,
    CardContent,
    Tabs,
    Tab,
    Box,
    Typography,
} from '@mui/material';

const ImageEditor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const imageData = localStorage.getItem('editImage');

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [texts, setTexts] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [newText, setNewText] = useState('');
    const [fontSize, setFontSize] = useState(20);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [tabValue, setTabValue] = useState(0);
    const stageRef = useRef(null);

    useEffect(() => {
        if (imageData) {
            const img = new window.Image();
            img.src = `data:image/png;base64,${imageData}`;
            img.onload = () => {
                setBackgroundImage(img);
                setStageSize({
                    width: Math.min(img.width, window.innerWidth * 0.5),
                    height: Math.min(img.height, window.innerHeight * 0.5),
                });
            };
        }
    }, [imageData]);

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const addText = () => {
        if (newText) {
            setTexts([
                ...texts,
                {
                    text: newText,
                    x: 50,
                    y: 50,
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    draggable: true,
                    id: `text${texts.length + 1}`,
                },
            ]);
            setNewText('');
        }
    };

    const handleTextDragEnd = (e, id) => {
        const updatedTexts = texts.map((t) =>
            t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t
        );
        setTexts(updatedTexts);
    };

    const handleTransform = (id, newProps) => {
        const updatedTexts = texts.map((t) =>
            t.id === id ? { ...t, ...newProps } : t
        );
        setTexts(updatedTexts);
    };

    const saveImage = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Image Editor
            </Typography>
            {backgroundImage ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Card sx={{
                        width: { xs: '100%', md: '30%', ls: '40%' },
                        align: { xs: 'center' }
                    }}>
                        <CardContent>
                            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                <Tab label="Text" />
                                <Tab label="Transform" />
                            </Tabs>
                            {tabValue === 0 && (
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Enter text"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                    />
                                    <Select
                                        fullWidth
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                    >
                                        <MenuItem value="Arial">Arial</MenuItem>
                                        <MenuItem value="Helvetica">Helvetica</MenuItem>
                                        <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                                    </Select>
                                    <Typography gutterBottom>Font Size</Typography>
                                    <Slider
                                        value={fontSize}
                                        onChange={(e, newValue) => setFontSize(newValue)}
                                        min={10}
                                        max={100}
                                        step={1}
                                    />
                                    <Button variant="contained" onClick={addText}>Add Text</Button>
                                </Box>
                            )}
                            {tabValue === 1 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography>Select an object on the canvas to transform it.</Typography>
                                </Box>
                            )}
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button variant="contained" onClick={saveImage}>Save Image</Button>
                                <Button variant="outlined" onClick={() => navigate('/')}>Go Back</Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Box sx={{
                        width: {
                            xs: '100%', md: '70%', ls: '60%'
                        },
                        align: { xs: 'center' }
                    }}>
                        <Stage
                            width={stageSize.width}
                            height={stageSize.height}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}
                            ref={stageRef}
                        >
                            <Layer>
                                <Image
                                    image={backgroundImage}
                                    width={stageSize.width}
                                    height={stageSize.height}
                                />
                                {texts.map((text, i) => (
                                    <Text
                                        key={i}
                                        text={text.text}
                                        x={text.x}
                                        y={text.y}
                                        fontSize={text.fontSize}
                                        fontFamily={text.fontFamily}
                                        draggable
                                        onDragEnd={(e) => handleTextDragEnd(e, text.id)}
                                        onClick={() => selectShape(text.id)}
                                        onTap={() => selectShape(text.id)}
                                    />
                                ))}
                                {selectedId && (
                                    <Transformer
                                        nodes={[stageRef.current.findOne(`#${selectedId}`)]}
                                        onTransform={() => {
                                            const node = stageRef.current.findOne(`#${selectedId}`);
                                            handleTransform(selectedId, {
                                                x: node.x(),
                                                y: node.y(),
                                                width: node.width() * node.scaleX(),
                                                height: node.height() * node.scaleY(),
                                                rotation: node.rotation(),
                                            });
                                        }}
                                    />
                                )}
                            </Layer>
                        </Stage>
                    </Box>
                </Box>
            ) : (
                <Typography variant='h5' align="center" color="error">No image selected for editing.</Typography>
            )
            }
        </Box >
    );
};

export default ImageEditor;