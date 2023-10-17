// Global types library
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

import React from "react";

// Auth context
export interface AuthContextProps {
  children: React.ReactNode;
}

// Root layout
export interface RootLayoutProps {
  children: React.ReactNode;
  read: React.ReactNode;
}

// Stories
export interface StoryProps {
  id: string;
  user: {
    name: string;
  };
  userId: string;
  title: string;
  content: string;
  imageUrl: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
  rating?: number | null;
}

// StorySection
export interface StorySectionProps {
  title: string;
  content: string;
  imageUrl: string;
  user: {
    name: string;
  };
}

// Editor
export interface EditorProps {
  story?: StoryProps;
  longitude: number;
  latitude: number;
}

// Session
export interface SessionProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  expires: string;
}

// Temp Marker
export interface TempMarkerProps {
  longitude: number;
  latitude: number;
}

// Ratings
export interface RatingProps {
  id: string;
  userId: string;
  storyId: string;
  rating: number;
}

// Comments
export interface CommentProps {
  id: string;
  userId: string;
  storyId: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    image: string;
  };
}
