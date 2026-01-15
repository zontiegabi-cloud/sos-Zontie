import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="py-20 lg:py-32 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl lg:text-7xl text-foreground mb-8">
              PRIVACY <span className="text-primary">POLICY</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Last updated: August 2024
              </p>

              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">1. Introduction</h2>
                  <p className="leading-relaxed">
                    Welcome to Shadows of Soldiers. We respect your privacy and are committed to protecting your personal data. 
                    This privacy policy will inform you about how we look after your personal data when you visit our website 
                    and tell you about your privacy rights.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">2. Information We Collect</h2>
                  <p className="leading-relaxed mb-4">
                    We may collect, use, store and transfer different kinds of personal data about you:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Identity Data: first name, last name, username</li>
                    <li>Contact Data: email address</li>
                    <li>Technical Data: IP address, browser type, operating system</li>
                    <li>Usage Data: information about how you use our website and services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">3. How We Use Your Information</h2>
                  <p className="leading-relaxed mb-4">
                    We use your personal data for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>To provide and maintain our services</li>
                    <li>To notify you about changes to our services</li>
                    <li>To allow you to participate in playtests and community events</li>
                    <li>To provide customer support</li>
                    <li>To send newsletters and marketing communications (with your consent)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">4. Data Security</h2>
                  <p className="leading-relaxed">
                    We have implemented appropriate security measures to prevent your personal data from being accidentally 
                    lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees 
                    and partners who have a business need to know.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">5. Your Rights</h2>
                  <p className="leading-relaxed mb-4">
                    Under certain circumstances, you have rights under data protection laws including:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>The right to access your personal data</li>
                    <li>The right to correct inaccurate personal data</li>
                    <li>The right to request deletion of your personal data</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">6. Contact Us</h2>
                  <p className="leading-relaxed">
                    If you have any questions about this privacy policy or our privacy practices, please contact us 
                    through our social media channels or Discord community.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
