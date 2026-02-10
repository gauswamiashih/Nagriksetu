import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
   children?: ReactNode;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
   public state: State = {
      hasError: false,
      error: null,
   };

   public static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Uncaught error:", error, errorInfo);
   }

   public render() {
      if (this.state.hasError) {
         return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
               <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
               </div>
               <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
               <p className="text-muted-foreground max-w-md mb-6">
                  We apologize for the inconvenience. The application has encountered an unexpected error.
               </p>
               <div className="flex gap-4">
                  <Button
                     variant="outline"
                     onClick={() => window.location.reload()}
                  >
                     Refresh Page
                  </Button>
                  <Button
                     variant="default"
                     onClick={() => (window.location.href = "/")}
                  >
                     Go Home
                  </Button>
               </div>
               {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="mt-8 p-4 bg-muted rounded-lg text-left overflow-auto max-w-2xl w-full">
                     <p className="font-mono text-xs text-red-500 mb-2">
                        {this.state.error.toString()}
                     </p>
                  </div>
               )}
            </div>
         );
      }

      return this.props.children;
   }
}
