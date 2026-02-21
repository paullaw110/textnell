import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1a1a2e] mb-4">Privacy Policy</h1>
          <p className="text-[#6b7280] text-lg mb-12 font-body">Last updated: February 18, 2026</p>

          <div className="space-y-12 text-[#1a1a2e]">
            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">What We Collect</h2>
              <p className="mb-4 font-body leading-relaxed">
                When you use Nell, we collect the following information to provide our birthday reminder and relationship CRM service:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-body text-[#374151]">
                <li><strong>Phone number:</strong> Your phone number to communicate with you via SMS</li>
                <li><strong>Contact information:</strong> Names, birthdays, anniversaries, and other important dates you share with us</li>
                <li><strong>Messages:</strong> The text messages you send to and receive from Nell</li>
                <li><strong>Preferences:</strong> Your reminder preferences, timing settings, and service configuration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">How We Use Your Information</h2>
              <p className="mb-4 font-body leading-relaxed">
                We use your information solely to provide the Nell service:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-body text-[#374151] mb-4">
                <li>Send you birthday and anniversary reminders</li>
                <li>Respond to your questions and requests</li>
                <li>Maintain your personal relationship database</li>
                <li>Improve our service based on your feedback</li>
                <li>Provide customer support</li>
              </ul>
              <div className="bg-[#ff6b4a]/10 border-l-4 border-[#ff6b4a] p-4 rounded-r-lg">
                <p className="font-body font-medium">
                  <strong>We do not use your information for any other purpose.</strong> We don't sell your data, send marketing messages, or share your information with third parties for their marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">AI Processing</h2>
              <p className="mb-4 font-body leading-relaxed">
                Nell uses artificial intelligence powered by Anthropic's Claude to understand and respond to your messages. Here's what you should know:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-body text-[#374151]">
                <li>Your conversations are processed by Anthropic's AI systems to generate responses</li>
                <li>Anthropic does not use your data to train their models</li>
                <li>We implement security measures to protect your data during AI processing</li>
                <li>AI processing helps Nell understand context, dates, and provide helpful reminders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Data Security</h2>
              <p className="font-body leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">We Don't Sell Your Data</h2>
              <div className="bg-[#FFD93D]/20 border-2 border-[#FFD93D] p-6 rounded-2xl">
                <p className="font-body font-semibold text-lg">
                  <strong>We never sell, rent, or trade your personal information to third parties.</strong> Your data is used exclusively to provide the Nell service to you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Data Retention</h2>
              <p className="font-body leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide you services. If you stop using Nell, we will retain your data for a reasonable period in case you want to reactivate the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Your Rights</h2>
              <p className="mb-4 font-body leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 font-body text-[#374151]">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of the service at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Opting Out</h2>
              <div className="bg-[#ff6b4a]/10 border-2 border-[#ff6b4a] p-6 rounded-2xl">
                <p className="font-body leading-relaxed">
                  You can stop receiving messages from Nell at any time by texting <strong>STOP</strong> to <strong>(279) 529-0731</strong>. This will immediately unsubscribe you from all future messages.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Changes to This Policy</h2>
              <p className="font-body leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-[#1a1a2e] mb-4 border-b-2 border-[#ff6b4a]/20 pb-2">Contact Us</h2>
              <p className="mb-4 font-body leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="space-y-2 font-body">
                <p>
                  <strong>Email:</strong> <a href="mailto:lawrencep.design@gmail.com" className="text-[#ff6b4a] hover:text-[#e55a3a] transition-colors">lawrencep.design@gmail.com</a>
                </p>
                <p>
                  <strong>Text:</strong> <a href="sms:+12795290731" className="text-[#ff6b4a] hover:text-[#e55a3a] transition-colors">(279) 529-0731</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}