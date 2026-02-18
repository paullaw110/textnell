import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-zinc-400 text-lg mb-8">Last updated: February 18, 2026</p>

          <div className="space-y-8 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Collect</h2>
              <p className="mb-4">
                When you use Nell, we collect the following information to provide our birthday reminder and relationship CRM service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Phone number:</strong> Your phone number to communicate with you via SMS</li>
                <li><strong>Contact information:</strong> Names, birthdays, anniversaries, and other important dates you share with us</li>
                <li><strong>Messages:</strong> The text messages you send to and receive from Nell</li>
                <li><strong>Preferences:</strong> Your reminder preferences, timing settings, and service configuration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use your information solely to provide the Nell service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send you birthday and anniversary reminders</li>
                <li>Respond to your questions and requests</li>
                <li>Maintain your personal relationship database</li>
                <li>Improve our service based on your feedback</li>
                <li>Provide customer support</li>
              </ul>
              <p className="mt-4">
                <strong>We do not use your information for any other purpose.</strong> We don't sell your data, send marketing messages, or share your information with third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">AI Processing</h2>
              <p className="mb-4">
                Nell uses artificial intelligence powered by Anthropic's Claude to understand and respond to your messages. Here's what you should know:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your conversations are processed by Anthropic's AI systems to generate responses</li>
                <li>Anthropic does not use your data to train their models</li>
                <li>We implement security measures to protect your data during AI processing</li>
                <li>AI processing helps Nell understand context, dates, and provide helpful reminders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibent text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">We Don't Sell Your Data</h2>
              <p>
                <strong>We never sell, rent, or trade your personal information to third parties.</strong> Your data is used exclusively to provide the Nell service to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you services. If you stop using Nell, we will retain your data for a reasonable period in case you want to reactivate the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of the service at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Opting Out</h2>
              <p>
                You can stop receiving messages from Nell at any time by texting <strong>STOP</strong> to <strong>(279) 529-0731</strong>. This will immediately unsubscribe you from all future messages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:lawrencep.design@gmail.com" className="text-[#ff7849] hover:text-[#e56a42] transition-colors">lawrencep.design@gmail.com</a>
              </p>
              <p>
                <strong>Text:</strong> <a href="sms:+12795290731" className="text-[#ff7849] hover:text-[#e56a42] transition-colors">(279) 529-0731</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}