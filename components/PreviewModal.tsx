/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect, useCallback } from 'react';

const ZoomControls: React.FC<{ onZoomIn: () => void; onZoomOut: () => void; onReset: () => void; }> = ({ onZoomIn, onZoomOut, onReset }) => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/70 border border-gray-700 rounded-lg p-2 flex items-center justify-center gap-2 backdrop-blur-sm shadow-lg">
        <button onClick={onZoomOut} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors" aria-label="Perkecil">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
        </button>
        <button onClick={onReset} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors" aria-label="Atur ulang zoom">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0M2.985 19.644a8.25 8.25 0 0 1 0-11.664m11.664 0-3.181-3.183" /></svg>
        </button>
        <button onClick={onZoomIn} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors" aria-label="Perbesar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>
    </div>
);


interface PreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const lastPinchDist = useRef<number | null>(null);

    const resetZoom = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.005;
        const newScale = Math.max(0.5, Math.min(scale + delta, 8));
        
        if (imageRef.current && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const newX = mouseX - (mouseX - position.x) * (newScale / scale);
            const newY = mouseY - (mouseY - position.y) * (newScale / scale);

            setScale(newScale);
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isPanning.current = true;
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        if (imageRef.current) imageRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning.current) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - startPos.current.x,
            y: e.clientY - startPos.current.y
        });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        isPanning.current = false;
        if (imageRef.current) imageRef.current.style.cursor = scale > 1 ? 'grab' : 'default';
    };

    const getDistance = (touches: React.TouchList) => {
        const [touch1, touch2] = [touches[0], touches[1]];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            lastPinchDist.current = getDistance(e.touches);
        } else if (e.touches.length === 1) {
            handleMouseDown(e.touches[0] as unknown as React.MouseEvent);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastPinchDist.current !== null) {
            e.preventDefault();
            const newDist = getDistance(e.touches);
            const scaleFactor = newDist / lastPinchDist.current;
            const newScale = Math.max(0.5, Math.min(scale * scaleFactor, 8));
            setScale(newScale);
            lastPinchDist.current = newDist;
        } else if (e.touches.length === 1) {
            handleMouseMove(e.touches[0] as unknown as React.MouseEvent);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (e.touches.length < 2) {
            lastPinchDist.current = null;
        }
        if (e.touches.length < 1) {
            handleMouseUp(e as unknown as React.MouseEvent);
        }
    };

    return (
        <div 
            className="preview-modal-backdrop"
            onClick={onClose}
        >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-[101] text-white bg-gray-900/50 p-2 rounded-full hover:bg-gray-800/80 transition-colors"
              aria-label="Tutup pratinjau"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>

            <div
                ref={containerRef}
                className="preview-modal-content"
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Pratinjau gambar yang diperbesar"
                    className="max-w-full max-h-full object-contain select-none"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isPanning.current ? 'none' : 'transform 0.1s ease-out',
                        cursor: scale > 1 ? 'grab' : 'default'
                    }}
                />
            </div>

            <ZoomControls 
                onZoomIn={() => setScale(s => Math.min(s * 1.2, 8))}
                onZoomOut={() => setScale(s => Math.max(s / 1.2, 0.5))}
                onReset={resetZoom}
            />
        </div>
    );
};

export default PreviewModal;