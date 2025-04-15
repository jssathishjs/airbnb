import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Ensure we have at least 4 images by duplicating if needed
  const displayImages = images.length < 4 
    ? [...images, ...images].slice(0, 4) 
    : images;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 relative group">
          <img
            src={images[0]}
            alt="Main Property Image"
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800"
            onClick={() => setViewerOpen(true)}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
        {displayImages.slice(1, 3).map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Property Image ${index + 2}`}
              className="w-full h-48 object-cover rounded-lg"
              onClick={() => {
                setCurrentIndex(index + 1);
                setViewerOpen(true);
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg cursor-pointer"></div>
          </div>
        ))}
      </div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-6xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-black/50">
            <DialogTitle className="text-white">Property Gallery</DialogTitle>
            <DialogDescription className="text-gray-300">
              Image {currentIndex + 1} of {images.length}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative flex-grow flex items-center justify-center bg-black">
            <img
              src={images[currentIndex]}
              alt={`Property Image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full h-10 w-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full h-10 w-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="p-4 bg-white flex overflow-x-auto space-x-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`h-16 w-24 flex-shrink-0 cursor-pointer border-2 ${
                  index === currentIndex ? "border-primary" : "border-transparent"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
