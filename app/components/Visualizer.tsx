// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const Visualizer = ({ microphone }: { microphone: MediaRecorder }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const barWidth = 10;
//     let x = 0;
//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     for (const value of dataArray) {
//       const barHeight = (value / 255) * height * 2;

//       const interpolationFactor = value / 255;

//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
//       context.fillRect(x, height - barHeight, barWidth, barHeight);
//       x += barWidth;
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default Visualizer;
//====================Circular==========================================================
// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const CircularVisualizer = ({ microphone }: { microphone: MediaRecorder }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const radius = Math.min(width, height) / 3;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const sliceAngle = (Math.PI * 2) / dataArray.length;

//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const barHeight = (value / 255) * radius;
//       const angle = sliceAngle * i;

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       context.beginPath();
//       context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
//       context.lineWidth = 2;

//       const xStart = centerX + Math.cos(angle) * radius;
//       const yStart = centerY + Math.sin(angle) * radius;
//       const xEnd = centerX + Math.cos(angle) * (radius + barHeight);
//       const yEnd = centerY + Math.sin(angle) * (radius + barHeight);

//       context.moveTo(xStart, yStart);
//       context.lineTo(xEnd, yEnd);
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default CircularVisualizer;


//============Vartical===================================//
// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const GlowingCircularVisualizer = ({
//   microphone,
// }: {
//   microphone: MediaRecorder;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
    
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const radius = Math.min(width, height) / 3;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const sliceAngle = (Math.PI * 2) / dataArray.length;

//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const barHeight = (value / 255) * radius;
//       const angle = sliceAngle * i;

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       context.beginPath();

//       // Apply glow effect
//       context.shadowBlur = 20; // Strength of the glow
//       context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`; // Glow color

//       context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`; // Bar color
//       context.lineWidth = 3;

//       const xStart = centerX + Math.cos(angle) * radius;
//       const yStart = centerY + Math.sin(angle) * radius;
//       const xEnd = centerX + Math.cos(angle) * (radius + barHeight);
//       const yEnd = centerY + Math.sin(angle) * (radius + barHeight);

//       context.moveTo(xStart, yStart);
//       context.lineTo(xEnd, yEnd);
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default GlowingCircularVisualizer;
 
// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const VerticalWaveVisualizer = ({
//   microphone,
// }: {
//   microphone: MediaRecorder;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const lineWidth = 5;
//     const barSpacing = 4; // Space between wave segments

//     context.lineWidth = lineWidth;
//     context.lineCap = "round";

//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const barHeight = (value / 255) * height;

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       let x = centerX;
//       const yStart = height / 2 - barHeight / 2; // Centered vertically
//       const yEnd = yStart + barHeight;

//       context.beginPath();
//       context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
//       context.shadowBlur = 15;
//       context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
//       context.moveTo(x, yStart);
//       context.lineTo(x, yEnd);
//       context.stroke();

//       if (i % 4 === 0) x += lineWidth + barSpacing; // Optional ripple effect
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default VerticalWaveVisualizer;

// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const HorizontalWaveVisualizer = ({
//   microphone,
// }: {
//   microphone: MediaRecorder;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerY = height / 2;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const barWidth = 4; // Fixed width for each bar
//     const barSpacing = 2; // Space between bars

//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const barLength = (value / 255) * (height / 2); // Bar length adjusts dynamically

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       const x = i * (barWidth + barSpacing); // Position bars horizontally
//       const yStart = centerY - barLength / 2; // Center the bar vertically
//       const yEnd = yStart + barLength;

//       context.beginPath();
//       context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
//       context.shadowBlur = 15;
//       context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
//       context.lineWidth = barWidth;
//       context.moveTo(x, yStart);
//       context.lineTo(x, yEnd);
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default HorizontalWaveVisualizer;

// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const SmoothWaveVisualizer = ({
//   microphone,
// }: {
//   microphone: MediaRecorder;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerY = height / 2;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const barWidth = 2; // Narrow bars
//     const smoothness = 1; // Adjust smoothness factor
//     const spacing = 1; // Small spacing for smoother appearance

//     context.lineJoin = "round";
//     context.lineWidth = barWidth;

//     for (let i = 0; i < dataArray.length; i++) {
//       // Smooth interpolation between values
//       const value = (dataArray[i - 1] || dataArray[i]) * (1 - smoothness) + dataArray[i] * smoothness;
//       const barLength = (value / 255) * (height / 2); // Dynamic length

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       const x = i * (barWidth + spacing); // Horizontal position
//       const yStart = centerY - barLength / 2; // Center vertically
//       const yEnd = yStart + barLength;

//       context.beginPath();
//       context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`;
//       context.shadowBlur = 10;
//       context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
//       context.moveTo(x, yStart);
//       context.lineTo(x, yEnd);
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default SmoothWaveVisualizer;

//===========================horizontal-=====================================//
// import React, { useEffect, useRef } from "react";

// const interpolateColor = (
//   startColor: number[],
//   endColor: number[],
//   factor: number
// ): number[] => {
//   const result = [];
//   for (let i = 0; i < startColor.length; i++) {
//     result[i] = Math.round(
//       startColor[i] + factor * (endColor[i] - startColor[i])
//     );
//   }
//   return result;
// };

// const CircleWaveVisualizer = ({
//   microphone,
// }: {
//   microphone: MediaRecorder;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerY = height / 2;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     const startColor = [19, 239, 147];
//     const endColor = [20, 154, 251];

//     const circleRadius = 1; // Fixed size for each circle
//     const spacing = 1; // Space between circles

//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const radius = (value / 255) * 20 + circleRadius; // Dynamic radius

//       const interpolationFactor = value / 255;
//       const color = interpolateColor(startColor, endColor, interpolationFactor);

//       const x = i * (circleRadius * 1 + spacing); // Horizontal position
//       const y = centerY;

//       context.beginPath();
//       context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
//       context.shadowBlur = 50;
//       context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
//       context.arc(x, y, radius, 0, 2 * Math.PI);
//       context.fill();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default CircleWaveVisualizer;
//==================== glowing=================================================================================//

// import React, { useEffect, useRef } from "react";

// const CircularVisualizer = ({ microphone }: { microphone: MediaRecorder }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const baseRadius = Math.min(width, height) / 3;

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     // Calculate average amplitude to drive glow intensity
//     const avgAmplitude =
//       dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

//     // Calculate dynamic radius based on amplitude
//     const dynamicRadius = baseRadius + (avgAmplitude / 255) * 50;

//     // Create radial gradient for glowing effect
//     const gradient = context.createRadialGradient(
//       centerX,
//       centerY,
//       baseRadius / 2,
//       centerX,
//       centerY,
//       dynamicRadius
//     );
//     gradient.addColorStop(0, "rgba(19, 239, 147, 0.8)");
//     gradient.addColorStop(0.5, "rgba(20, 154, 251, 0.4)");
//     gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

//     // Draw the glowing circular shape
//     context.beginPath();
//     context.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
//     context.fillStyle = gradient;
//     context.fill();

//     // Optional: Add glowing "spikes" around the circle
//     const sliceAngle = (Math.PI * 2) / dataArray.length;
//     for (let i = 0; i < dataArray.length; i++) {
//       const value = dataArray[i];
//       const spikeLength = (value / 255) * 30;

//       const angle = sliceAngle * i;
//       const xStart = centerX + Math.cos(angle) * dynamicRadius;
//       const yStart = centerY + Math.sin(angle) * dynamicRadius;
//       const xEnd = centerX + Math.cos(angle) * (dynamicRadius + spikeLength);
//       const yEnd = centerY + Math.sin(angle) * (dynamicRadius + spikeLength);

//       context.beginPath();
//       context.moveTo(xStart, yStart);
//       context.lineTo(xEnd, yEnd);
//       context.strokeStyle = `rgba(255, 255, 255, ${value / 255})`;
//       context.lineWidth = 2;
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default CircularVisualizer;


//========================== circular working ===========================================================================//
// import React, { useEffect, useRef } from "react";

// const CircularVisualizer = ({ microphone }: { microphone: MediaRecorder }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioContext.createAnalyser();
//   const dataArray = new Uint8Array(analyser.frequencyBinCount);

//   useEffect(() => {
//     const source = audioContext.createMediaStreamSource(microphone.stream);
//     source.connect(analyser);

//     draw();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const draw = (): void => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const baseRadius = Math.min(width, height) / 6;  // Smaller circle size

//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     if (!context) return;

//     context.clearRect(0, 0, width, height);

//     // Use the average amplitude for all spikes
//     const avgAmplitude =
//       dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

//     // Calculate dynamic radius based on average amplitude
//     const dynamicRadius = baseRadius + (avgAmplitude / 255) * 50;

//     // Create radial gradient for glowing effect
//     const gradient = context.createRadialGradient(
//       centerX,
//       centerY,
//       baseRadius / 2,
//       centerX,
//       centerY,
//       dynamicRadius
//     );
//     gradient.addColorStop(0, "rgb(27, 13, 15)");
//     gradient.addColorStop(0.5, "rgba(20, 154, 251, 0.4)");
//     gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

//     // Draw the glowing circular shape
//     context.beginPath();
//     context.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
//     context.fillStyle = gradient;
//     context.fill();

//     // Add glowing spikes that all react to the same factor
//     const sliceAngle = (Math.PI * 2) / dataArray.length;
//     const spikeLength = (avgAmplitude / 255) * 1000;  // Use average amplitude for uniform spikes

//     for (let i = 0; i < dataArray.length; i++) {
//       const angle = sliceAngle * i;
//       const xStart = centerX + Math.cos(angle) * dynamicRadius;
//       const yStart = centerY + Math.sin(angle) * dynamicRadius;
//       const xEnd = centerX + Math.cos(angle) * (dynamicRadius + spikeLength);
//       const yEnd = centerY + Math.sin(angle) * (dynamicRadius + spikeLength);

//       context.beginPath();
//       context.moveTo(xStart, yStart);
//       context.lineTo(xEnd, yEnd);
//       context.strokeStyle = `rgba(255, 255, 255, ${avgAmplitude / 255})`;
//       context.lineWidth = 2;
//       context.stroke();
//     }
//   };

//   return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
// };

// export default CircularVisualizer;




import React, { useEffect, useRef } from "react";

const CircularVisualizer = ({ microphone }: { microphone: MediaRecorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  useEffect(() => {
    const source = audioContext.createMediaStreamSource(microphone.stream);
    source.connect(analyser);

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 5;  // Smaller circle size

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    if (!context) return;

    context.clearRect(0, 0, width, height);

    // Use the average amplitude for all spikes
    const avgAmplitude =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // Calculate dynamic radius based on average amplitude
    const dynamicRadius = baseRadius + (avgAmplitude / 255) * 50;

    // Create radial gradient for glowing effect
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      baseRadius / 2,
      centerX,
      centerY,
      dynamicRadius
    );
    gradient.addColorStop(0, "rgb(27, 13, 15)");
    gradient.addColorStop(0, "rgb(27, 13, 15)");
    gradient.addColorStop(0.5, "rgb(130, 13, 15)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    // gradient.addColorStop(0, "rgba(0, 255, 170, 0.9)"); // Neon green for a high-tech vibe
    // gradient.addColorStop(0.3, "rgba(0, 213, 255, 0.7)"); // Electric blue for AI energy
    // gradient.addColorStop(0.6, "rgba(90, 0, 255, 0.5)"); // Deep purple for a techy, mysterious feel
    // gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)"); // Subtle black fade for depth
    
    // Draw the glowing circular shape
    context.beginPath();
    context.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    // Add glowing spikes that all react to the same factor
    const sliceAngle = (Math.PI * 2) / dataArray.length;
    const spikeLength = (avgAmplitude / 255) * 250;  // Use average amplitude for uniform spikes

    for (let i = 0; i < dataArray.length; i++) {
      const angle = sliceAngle * i;
      const xStart = centerX + Math.cos(angle) * dynamicRadius;
      const yStart = centerY + Math.sin(angle) * dynamicRadius;
      const xEnd = centerX + Math.cos(angle) * (dynamicRadius + spikeLength);
      const yEnd = centerY + Math.sin(angle) * (dynamicRadius + spikeLength);

      // Apply color based on the position of the spike
      const color = `hsl(${(i / dataArray.length) * 360}, 60%, 75%)`; // Color spectrum

      context.beginPath();
      context.moveTo(xStart, yStart);
      context.lineTo(xEnd, yEnd);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
    }
  };

  return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
};

export default CircularVisualizer;
