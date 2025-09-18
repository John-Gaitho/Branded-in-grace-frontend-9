import { MessageCircle, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SocialMediaButtons() {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <Button
        onClick={() => window.open('https://wa.me/254720602028', '_blank')}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl animate-float hover-scale transition-all duration-300"
        style={{ animationDelay: '0s' }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Instagram */}
      <Button
        onClick={() => window.open('https://www.instagram.com/branded_in_grace', '_blank')}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl animate-float hover-scale transition-all duration-300"
        style={{ animationDelay: '0.2s' }}
      >
        <Instagram className="h-6 w-6" />
      </Button>

      {/* Facebook */}
      <Button
        onClick={() => window.open('https://www.facebook.com/profile.php?id=61559840783163&mibextid=ZbWKwL', '_blank')}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl animate-float hover-scale transition-all duration-300"
        style={{ animationDelay: '0.4s' }}
      >
        <Facebook className="h-6 w-6" />
      </Button>
    </div>
  );
}
