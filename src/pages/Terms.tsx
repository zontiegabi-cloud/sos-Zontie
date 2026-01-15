import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";

export default function Terms() {
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
              TERMS & <span className="text-primary">CONDITIONS</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Last updated: August 2024
              </p>

              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">1. Agreement to Terms</h2>
                  <p className="leading-relaxed">
                    By accessing or using the Shadows of Soldiers website and services, you agree to be bound by these 
                    Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">2. Intellectual Property</h2>
                  <p className="leading-relaxed">
                    The Shadows of Soldiers name, logo, game content, website design, and all related materials are 
                    protected by copyright, trademark, and other intellectual property laws. You may not use, copy, 
                    or distribute any content without our express written permission.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">3. User Conduct</h2>
                  <p className="leading-relaxed mb-4">
                    When using our services, you agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Distribute malware or engage in hacking activities</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with the proper operation of our services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">4. Playtest Participation</h2>
                  <p className="leading-relaxed">
                    Participation in playtests is subject to additional terms. Playtest content is confidential and 
                    may not be shared, streamed, or recorded without explicit permission. Feedback provided during 
                    playtests becomes the property of Shadows of Soldiers.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">5. Disclaimer of Warranties</h2>
                  <p className="leading-relaxed">
                    Our services are provided "as is" without warranties of any kind, either express or implied. 
                    We do not guarantee that our services will be uninterrupted, secure, or error-free.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">6. Limitation of Liability</h2>
                  <p className="leading-relaxed">
                    In no event shall Shadows of Soldiers be liable for any indirect, incidental, special, or 
                    consequential damages arising out of or in connection with your use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">7. Changes to Terms</h2>
                  <p className="leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately 
                    upon posting. Your continued use of our services after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-2xl text-foreground uppercase mb-4">8. Contact</h2>
                  <p className="leading-relaxed">
                    For any questions regarding these Terms and Conditions, please reach out through our 
                    official social media channels or Discord community.
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
