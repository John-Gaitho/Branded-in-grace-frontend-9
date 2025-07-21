import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Branded in Grace</h1>
          <p className="text-xl text-muted-foreground">
            Inspiring faith through beautiful, meaningful designs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At Branded in Grace, we believe that faith should be beautifully expressed in our daily lives. 
                Our mission is to create high-quality products that allow you to showcase your beliefs with 
                elegance and style, inspiring conversations and spreading hope wherever you go.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Founded with a passion for combining faith and fashion, Branded in Grace started as a small 
                dream to create meaningful products that resonate with believers worldwide. Every design is 
                crafted with care, love, and the intention to uplift and encourage.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🙏</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Faith</h3>
              <p className="text-muted-foreground">
                Every product is designed to honor and celebrate faith in meaningful ways.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We're committed to providing exceptional quality in every product we create.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Building a community of believers who support and encourage one another.
              </p>
            </div>
          </div>
        </div>

        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for being part of our story. Together, we're spreading faith, hope, and love 
              through beautiful designs that make a difference in the world.
            </p>
            <p className="text-lg font-semibold text-primary">
              "She is clothed with strength and dignity; she can laugh at the days to come." - Proverbs 31:25
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;