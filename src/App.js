import React,{useState,useEffect,useRef} from 'react';
import logo from './logo.svg';
import './App.css';

import { io } from 'socket.io-client';

const socket = io('http://121.133.122.31:9999');

function App() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);


  const handleMouseClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    socket.emit('mouse-click', { x, y });
  };


   useEffect(() => {
    console.log('test!')
        socket.on('screen-update', (data) => {
            const img = new Image();
            img.src = `data:image/png;base64,${data}`;
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        });

        return () => {
            socket.off('screen-update');
        };
    }, []);

  return (
    <div onClick={handleMouseClick}>
      <h1>원격 제어 클라이언트</h1>
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}

export default App;