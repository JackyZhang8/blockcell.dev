import React from 'react';

export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  EVOLVING = 'EVOLVING'
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}