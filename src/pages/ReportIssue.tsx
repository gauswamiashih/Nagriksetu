import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { issueService } from '@/services/api'; // Direct service for categories
import { MapPicker } from '@/components/MapPicker';
import { FileText, Upload, MapPin, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description is too long'),
  category: z.string().min(1, 'Please select a category'),
});

export default function ReportIssue() {
  const { user, isAdmin } = useAuth();
  const { createIssue, isLoading } = useIssues();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await issueService.getCategories();
        const mapped = data.map(cat => {
          let icon = '📋';
          const lower = cat.name.toLowerCase();
          if (lower.includes('road')) icon = '🛣️';
          else if (lower.includes('water')) icon = '💧';
          else if (lower.includes('elect')) icon = '⚡';
          else if (lower.includes('sanitation') || lower.includes('garbage')) icon = '🗑️';
          else if (lower.includes('light')) icon = '💡';
          else if (lower.includes('drain')) icon = '🚰';
          else if (lower.includes('safe')) icon = '👮';
          return { ...cat, icon };
        });
        setCategories(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetch();
  }, []);

  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '', // Stores ID
  });
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});


  // ... (keep existing effects)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({ lat, lng, address });
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      issueSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (!location) {
      setErrors(prev => ({ ...prev, location: 'Please select a location' }));
      return;
    }

    if (!imageFile) {
      setErrors(prev => ({ ...prev, image: 'Photo evidence is required' }));
      return;
    }

    if (!user) {
      toast.error('You must be logged in to report an issue');
      return;
    }

    try {
      // 1. Upload Image
      const imageUrl = await issueService.uploadImage(imageFile);

      // 2. Create Issue
      const newIssue = await createIssue({
        title: formData.title,
        description: formData.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category_id: formData.category, // Changed from 'category' to 'category_id' to match API expectation
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        userId: user.id,
      });

      // 3. Link Image to Issue
      if (newIssue && newIssue.id) {
        await issueService.addImageRecord(newIssue.id, imageUrl);
      }

      toast.success('Issue reported successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error('Failed to report issue. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-64px)] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Report an Issue</h1>
              <p className="text-muted-foreground">
                Help us improve Banaskantha by reporting civic issues in your area
              </p>
            </div>

            <Card className="shadow-lg">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Issue Details</CardTitle>
                  <CardDescription>
                    Please provide accurate information to help us address the issue quickly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Large pothole on main road"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full bg-background" disabled={loadingCategories}>
                        <SelectValue placeholder={loadingCategories ? "Loading..." : "Select issue category"} />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please describe the issue in detail. Include any safety concerns, how long it has been present, and any other relevant information..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isLoading}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.description.length}/1000 characters
                    </p>
                    {errors.description && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Upload Photo * (Required for verification)</Label>
                    <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium">Click to upload an image</span>
                            <span className="text-xs text-muted-foreground">
                              JPG, PNG up to 5MB
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isLoading}
                          />
                        </label>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Location *
                      </Label>

                      <div className="flex bg-muted p-1 rounded-lg w-fit">
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${locationMode === 'auto'
                            ? 'bg-background shadow text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                          onClick={() => setLocationMode('auto')}
                        >
                          Auto-detect
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${locationMode === 'manual'
                            ? 'bg-background shadow text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                          onClick={() => setLocationMode('manual')}
                        >
                          Manual Pin
                        </button>
                      </div>
                    </div>

                    <div className={locationMode === 'auto' ? 'block' : 'hidden'}>
                      <div className="bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          We will automatically detect your current location.
                        </p>
                        <MapPicker
                          onLocationSelect={handleLocationSelect}
                          initialLat={location?.lat}
                          initialLng={location?.lng}
                        />
                      </div>
                    </div>

                    <div className={locationMode === 'manual' ? 'block' : 'hidden'}>
                      <p className="text-sm text-muted-foreground mb-2">
                        Click on the map to place the pin exactly where the issue is.
                      </p>
                      <MapPicker
                        onLocationSelect={handleLocationSelect}
                        initialLat={location?.lat}
                        initialLng={location?.lng}
                      />
                    </div>

                    {errors.location && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(-1)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
