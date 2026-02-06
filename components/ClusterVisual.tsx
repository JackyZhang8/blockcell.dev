import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StageType } from '../App';

const CENTER = 300; // Center point of the 600x600 container

// Node Generation Logic
const getNodesForStage = (stage: StageType) => {
    if (stage === 'single') {
        return [{ id: 0, x: 0, y: 0 }];
    }

    const nodes = [];
    // Adjust radius based on density. Hive needs to be tighter.
    const R = stage === 'cluster' ? 140 : 90; 
    const layers = stage === 'cluster' ? 1 : 2;

    // Center Node
    nodes.push({ id: 0, x: 0, y: 0 });

    let idCounter = 1;
    
    // Hexagonal Grid Generation using axial coordinates
    for (let q = -layers; q <= layers; q++) {
        for (let r = -layers; r <= layers; r++) {
            if (q === 0 && r === 0) continue; 
            if (Math.abs(q + r) <= layers) {
                // Axial to Pixel conversion
                const x = R * (3/2 * q);
                const y = R * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
                nodes.push({ id: idCounter++, x, y });
            }
        }
    }
    return nodes;
};

// --- SUB-COMPONENTS ---

// 1. Static Mesh Layer (Background structural lines)
const NetworkMesh = React.memo(({ connections }: { connections: any[] }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
        <defs>
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="#00ff9d" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1"/>
            </linearGradient>
        </defs>
        {connections.map((conn) => (
            <line 
                key={conn.id}
                x1={CENTER + conn.from.x} y1={CENTER + conn.from.y}
                x2={CENTER + conn.to.x} y2={CENTER + conn.to.y}
                stroke="url(#linkGradient)" 
                strokeWidth={conn.isTight ? "1" : "2"}
            />
        ))}
    </svg>
));

// 2. Transient Beams Layer - 精细连线，清晰可见
const BEAM_TRAVEL_TIME = "1.2s";
const BEAM_FADE_TIME = "1.5s";
const BEAM_COLOR = "#00ff9d";      // 亮绿色
const BEAM_GLOW = "#22d3aa";       // 柔和绿色

const HOVER_TRANSITION_MS = 520;
const HOVER_SCALE_TRANSITION = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';

const HOVER_BURST_COOLDOWN_MS = 1200;
const NEAREST_RING_TOLERANCE = 1.12;

const TransientLinks = React.memo(({ pulses }: { pulses: any[] }) => {
    const [nowMs, setNowMs] = useState<number>(() => Date.now());

    useEffect(() => {
        let rafId = 0;
        let mounted = true;
        const tick = () => {
            if (!mounted) return;
            setNowMs(Date.now());
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => {
            mounted = false;
            cancelAnimationFrame(rafId);
        };
    }, []);

    const fadeMs = parseFloat(BEAM_FADE_TIME) * 1000;

    return (
        <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 50, overflow: 'visible' }}
        >
                {pulses.map(pulse => {
                    const createdAt = typeof pulse.createdAt === 'number' ? pulse.createdAt : 0;
                    const ageMs = Math.max(0, nowMs - createdAt);
                    const fadeT = Math.min(1, ageMs / fadeMs);

                    const travelT = Math.min(1, ageMs / BEAM_TRAVEL_MS);
                    const x = CENTER + pulse.from.x + (pulse.to.x - pulse.from.x) * travelT;
                    const y = CENTER + pulse.from.y + (pulse.to.y - pulse.from.y) * travelT;

                    const glowOpacity = 0.5 * (1 - fadeT);
                    const coreOpacity = 0.9 * (1 - fadeT);

                    const dotOpacity = travelT < 0.85 ? 0.6 : Math.max(0, 0.6 * (1 - (travelT - 0.85) / 0.15));
                    const dotCoreOpacity = travelT < 0.9 ? 1 : Math.max(0, 1 - (travelT - 0.9) / 0.1);

                    return (
                        <g key={pulse.id}>
                            {/* 外层光晕 - 柔和 */}
                            <line 
                                x1={CENTER + pulse.from.x} 
                                y1={CENTER + pulse.from.y}
                                x2={CENTER + pulse.to.x} 
                                y2={CENTER + pulse.to.y}
                                stroke={BEAM_GLOW}
                                strokeWidth="3"
                                strokeOpacity={glowOpacity}
                                strokeLinecap="round"
                            />

                            {/* 核心连线 - 细线 */}
                            <line 
                                x1={CENTER + pulse.from.x} 
                                y1={CENTER + pulse.from.y}
                                x2={CENTER + pulse.to.x} 
                                y2={CENTER + pulse.to.y}
                                stroke={BEAM_COLOR}
                                strokeWidth="1.5"
                                strokeOpacity={coreOpacity}
                                strokeLinecap="round"
                            />

                            {/* 传输光点 - 外层 */}
                            <circle r="6" fill={BEAM_GLOW} opacity={dotOpacity} cx={x} cy={y} />

                            {/* 传输光点 - 核心 */}
                            <circle r="3" fill="#ffffff" opacity={dotCoreOpacity} cx={x} cy={y} />
                        </g>
                    );
                })}
        </svg>
    );
});

// 3. Individual Unit - 与顶部 Logo 相同的多层旋转形态
const HexagonNode = React.memo(({ isActive, isHovered, activationType, index, x, y, scale, onHoverChange }: { 
    isActive: boolean;
    isHovered: boolean;
    activationType?: 'source' | 'target' | 'both';
    index: number; 
    x: number; 
    y: number; 
    scale: number;
    onHoverChange?: (hovered: boolean) => void;
}) => {
    const finalScale = scale * ((isActive || isHovered) ? 1.15 : 1);
    const coreFill = (isActive || isHovered) ? BEAM_COLOR : "#ea580c";
    const isLit = isActive || isHovered;
    
    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: CENTER + x, top: CENTER + y }}
        >
            <div 
                className="relative w-24 h-24 flex items-center justify-center"
                style={{ transform: `scale(${finalScale})`, transition: HOVER_SCALE_TRANSITION, cursor: 'pointer' }}
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
            >
                <div
                    className={`absolute inset-0 rounded-full transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        transitionDuration: `${HOVER_TRANSITION_MS}ms`,
                        boxShadow: '0 0 30px rgba(0,255,157,0.16), 0 0 60px rgba(0,255,157,0.08)'
                    }}
                />

                <div
                    className={`absolute inset-0 rounded-full transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDuration: `${HOVER_TRANSITION_MS}ms` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#00ff9d]/70 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#00ff9d]/70 animate-pulse" style={{ transform: 'translate(-50%, -50%) translateX(18px)', animationDelay: '120ms' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#00ff9d]/70 animate-pulse" style={{ transform: 'translate(-50%, -50%) translateY(-18px)', animationDelay: '240ms' }} />
                </div>

                {/* 旋转容器 - 与 Logo 相同 */}
                <div className="relative w-full h-full animate-[spin_20s_linear_infinite]">
                    
                    {/* Background Hexagon (Dark Structure) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg width="80" height="93" viewBox="0 0 100 116" fill="none" className="opacity-50">
                            <path 
                                d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" 
                                fill="#0f172a" 
                                stroke="#ea580c" 
                                strokeWidth="2"
                            />
                        </svg>
                    </div>

                    {/* Mid Layer Hexagon (Rust Orange - Hardware) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
                        <svg width="64" height="74" viewBox="0 0 100 116" fill="none" className="opacity-70">
                            <path 
                                d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" 
                                stroke="#ea580c" 
                                strokeWidth="4" 
                                strokeDasharray="10 5"
                            />
                        </svg>
                    </div>

                    {/* Inner Core - 激活时变绿色并脉冲 */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isLit ? 'animate-pulse' : ''}`}>
                        <svg width="32" height="37" viewBox="0 0 100 116" fill="none">
                            <path 
                                d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" 
                                fill={coreFill}
                                className={isLit ? 'drop-shadow-[0_0_12px_rgba(0,255,157,0.45)]' : 'opacity-60'}
                                style={{ transition: `fill ${HOVER_TRANSITION_MS}ms ease-out` }}
                            />
                        </svg>
                    </div>
                </div>
                
                {/* ID Label */}
                <div 
                    className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest whitespace-nowrap
                        ${isLit ? 'font-bold' : 'text-slate-600 opacity-0 md:opacity-100'}
                        ${scale < 0.7 ? 'opacity-0' : ''}
                    `}
                    style={{ color: isLit ? BEAM_COLOR : undefined, transition: 'color 0.45s ease-out' }}
                >
                    CELL_{index.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
});


// 动画时间常量
const BEAM_TRAVEL_MS = 1200;  // 光束传输时间
const TARGET_LIGHT_DELAY = BEAM_TRAVEL_MS; // 目标节点在光束到达后亮起

export const ClusterVisual: React.FC<{ stage: StageType }> = ({ stage }) => {
  // activeNodes 现在存储 { id, type } 对象以区分源和目标
  const [activeNodeMap, setActiveNodeMap] = useState<Map<number, 'source' | 'target' | 'both'>>(new Map());
  const [pulses, setPulses] = useState<any[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);

  const hoverBurstLastFiredAtRef = useRef<Map<number, number>>(new Map());
  const hoverBurstTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 1. Memoize Nodes
  const nodes = useMemo(() => getNodesForStage(stage), [stage]);

  useEffect(() => {
    return () => {
      hoverBurstTimeoutsRef.current.forEach((t) => clearTimeout(t));
      hoverBurstTimeoutsRef.current = [];
    };
  }, []);

  // 2. Memoize Connections
  const connections = useMemo(() => {
    if (stage === 'single') return [];
    
    const conns: any[] = [];
    const maxDist = stage === 'cluster' ? 160 : 100; 

    nodes.forEach((node, i) => {
        nodes.forEach((target, j) => {
            if (i < j) {
                 const dist = Math.hypot(node.x - target.x, node.y - target.y);
                 if (dist > 1 && dist < maxDist) {
                     conns.push({ 
                         id: `${i}-${j}`, 
                         from: node, 
                         to: target,
                         isTight: dist < 100
                     });
                 }
            }
        });
    });
    return conns;
  }, [nodes, stage]);

  const scale = stage === 'single' ? 1.8 : stage === 'cluster' ? 1 : 0.65;

  const fireHoverBurst = (sourceNodeId: number) => {
    if (stage === 'single') return;

    const now = Date.now();
    const last = hoverBurstLastFiredAtRef.current.get(sourceNodeId) ?? 0;
    if (now - last < HOVER_BURST_COOLDOWN_MS) return;
    hoverBurstLastFiredAtRef.current.set(sourceNodeId, now);

    const source = nodes.find((n) => n.id === sourceNodeId);
    if (!source) return;

    const distances = nodes
      .filter((n) => n.id !== sourceNodeId)
      .map((n) => ({ node: n, dist: Math.hypot(n.x - source.x, n.y - source.y) }))
      .filter((d) => d.dist > 1);

    if (distances.length === 0) return;

    let minDist = Infinity;
    for (const d of distances) {
      if (d.dist < minDist) minDist = d.dist;
    }

    const ringTargets = distances
      .filter((d) => d.dist <= minDist * NEAREST_RING_TOLERANCE)
      .map((d) => d.node);

    if (ringTargets.length === 0) return;

    setActiveNodeMap((prev) => {
      const next = new Map(prev);
      next.set(sourceNodeId, 'source');
      return next;
    });

    const createdAt = Date.now();
    const newPulses = ringTargets.map((to) => ({
      id: createdAt + Math.random(),
      from: source,
      to,
      color: BEAM_COLOR,
      createdAt
    }));

    setPulses((prev) => [...(prev || []), ...newPulses]);

    const fadeTimeout = setTimeout(() => {
      const ids = new Set(newPulses.map((p) => p.id));
      setPulses((prev) => prev.filter((p) => !ids.has(p.id)));
    }, parseFloat(BEAM_FADE_TIME) * 1000 + 100);
    hoverBurstTimeoutsRef.current.push(fadeTimeout);

    const arrivalTimeout = setTimeout(() => {
      setActiveNodeMap((prev) => {
        const next = new Map(prev);
        for (const t of ringTargets) next.set(t.id, 'target');
        return next;
      });
    }, BEAM_TRAVEL_MS);
    hoverBurstTimeoutsRef.current.push(arrivalTimeout);

    const sourceOffTimeout = setTimeout(() => {
      setActiveNodeMap((prev) => {
        const next = new Map(prev);
        next.delete(sourceNodeId);
        return next;
      });
    }, BEAM_TRAVEL_MS + 300);
    hoverBurstTimeoutsRef.current.push(sourceOffTimeout);

    const targetsOffTimeout = setTimeout(() => {
      setActiveNodeMap((prev) => {
        const next = new Map(prev);
        for (const t of ringTargets) next.delete(t.id);
        return next;
      });
    }, BEAM_TRAVEL_MS + 900);
    hoverBurstTimeoutsRef.current.push(targetsOffTimeout);
  };

  // 3. Effects Loop - 链式传输机制：节点接收光点后继续传输
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let isActive = true;

    // 发射光束的核心函数
    const fireBeam = (fromIdx: number) => {
        if (!isActive || stage === 'single') return;
        
        // 随机选择目标节点
        let targetIdx = Math.floor(Math.random() * nodes.length);
        let attempts = 0;
        while ((targetIdx === fromIdx) && attempts < 10) {
             targetIdx = Math.floor(Math.random() * nodes.length);
             attempts++;
        }

        if (fromIdx === targetIdx) return;

        const sourceId = nodes[fromIdx].id;
        const targetId = nodes[targetIdx].id;
        
        // 1. 源节点亮起（发射状态）
        setActiveNodeMap(prev => {
            const next = new Map(prev);
            next.set(sourceId, 'source');
            return next;
        });
        
        // 2. 发射光束
        const newPulse = {
            id: Date.now() + Math.random(),
            from: nodes[fromIdx],
            to: nodes[targetIdx],
            color: BEAM_COLOR,
            createdAt: Date.now()
        };
        
        setPulses(prev => [...(prev || []), newPulse]);
        
        // 动画结束后移除 pulse
        const t0 = setTimeout(() => {
            setPulses(prev => prev.filter(p => p.id !== newPulse.id));
        }, parseFloat(BEAM_FADE_TIME) * 1000 + 100);
        timeouts.push(t0);

        // 3. 光束到达后，目标节点亮起
        const t1 = setTimeout(() => {
            setActiveNodeMap(prev => {
                const next = new Map(prev);
                next.set(targetId, 'target');
                return next;
            });
        }, BEAM_TRAVEL_MS);
        timeouts.push(t1);
        
        // 4. 源节点熄灭
        const t2 = setTimeout(() => {
            setActiveNodeMap(prev => {
                const next = new Map(prev);
                next.delete(sourceId);
                return next;
            });
        }, BEAM_TRAVEL_MS + 300);
        timeouts.push(t2);
        
        // 5. 目标节点保持亮起一段时间后，继续传输给下一个节点
        const t3 = setTimeout(() => {
            setActiveNodeMap(prev => {
                const next = new Map(prev);
                next.delete(targetId);
                return next;
            });
            // 链式传输：目标节点成为新的源节点
            fireBeam(targetIdx);
        }, BEAM_TRAVEL_MS + 800);
        timeouts.push(t3);
    };

    if (stage === 'single') {
        // Single mode: just breathe
        const breathe = () => {
            setActiveNodeMap(prev => prev.size > 0 ? new Map() : new Map([[0, 'both']]));
        };
        breathe();
        const breatheId = setInterval(breathe, 2000);
        return () => clearInterval(breatheId);
    }

    // 启动多条传输链
    const chainCount = stage === 'hive' ? 2 : 1;
    for (let i = 0; i < chainCount; i++) {
        const startIdx = Math.floor(Math.random() * nodes.length);
        const delay = i * 800; // 错开启动时间
        const t = setTimeout(() => fireBeam(startIdx), delay);
        timeouts.push(t);
    }

    return () => {
        isActive = false;
        timeouts.forEach(t => clearTimeout(t));
    };
  }, [stage, nodes]);

  return (
    <div className="relative w-full max-w-[800px] h-[700px] flex items-center justify-center overflow-visible">
        
        {/* Container */}
        <div 
            className={`relative w-[600px] h-[600px] will-change-transform transition-all duration-1000
             ${stage === 'single' ? 'animate-[spin_120s_linear_infinite]' : 'animate-[spin_60s_linear_infinite]'}
            `}
        >
            
            {/* 1. Permanent Grid (Background) */}
            <NetworkMesh connections={connections} />
            
            {/* 2. Nodes (Middle) */}
            {nodes.map((node) => (
                <HexagonNode 
                    key={node.id}
                    index={node.id}
                    x={node.x}
                    y={node.y}
                    scale={scale}
                    isActive={activeNodeMap.has(node.id)}
                    isHovered={hoveredNodeId === node.id}
                    activationType={activeNodeMap.get(node.id)}
                    onHoverChange={(hovered) => {
                        if (hovered) {
                            setHoveredNodeId(node.id);
                            fireHoverBurst(node.id);
                            return;
                        }
                        setHoveredNodeId((prev) => (prev === node.id ? null : prev));
                    }}
                />
            ))}

            {/* 3. Transient Beams (Top Layer - z-30) */}
            <TransientLinks pulses={pulses} />

        </div>

        {/* Outer Context Rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <div className={`transition-all duration-1000 border rounded-full border-dashed
                ${stage === 'single' ? 'w-[400px] h-[400px] border-[#ea580c]/20' : 'w-[680px] h-[680px] border-[#ea580c]/10'}
                animate-[spin_40s_linear_infinite_reverse]
             `}></div>
             
             <div className={`absolute transition-all duration-1000 border rounded-full animate-pulse
                ${stage === 'hive' ? 'w-[750px] h-[750px] border-[#00ff9d]/10' : 'w-[500px] h-[500px] border-[#00ff9d]/5'}
             `}></div>
        </div>
    </div>
  );
};