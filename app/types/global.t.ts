// Global types library
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

// Auth context
export interface AuthContextProps {
  children: React.ReactNode;
}

// Root layout
export interface RootLayoutProps {
  children: React.ReactNode;
}

// Stories
export interface StoryProps {
  id: String;
  userId: String;
  title: String;
  content: String;
  imageUrl: String;
  longitude: Number;
  latitude: Number;
  createdAt: Date;
  updatedAt: Date;
  rating?: Number | null;
}

// Editor
export interface EditorProps {
  story?: StoryProps;
  longitude: Number;
  latitude: Number;
}

// Session
export interface SessionProps {
  user: {
    id: String;
    name: String;
    email: String;
    image: String;
  };
  expires: String;
}

// Temp Marker
export interface TempMarkerProps {
  longitude: Number;
  latitude: Number;
}
