import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert prose-zinc max-w-none">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-zinc-400 text-lg mb-8">Last updated: February 18, 2026</p>

          <div className="space-y-8 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <p>
                Nell is an SMS-based birthday reminder and personal relationship CRM service. By texting Nell at (279) 529-0731, you can store important dates, receive reminders, and manage your personal relationships through conversational AI.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p>
                By using Nell's services, sending text messages to (279) 529-0731, or accessing our website, you agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">SMS Terms and Consent</h2>
              <p className="mb-4">
                By texting Nell, you expressly consent to receive SMS messages from us. Here are the important details:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Message Frequency:</strong> Message frequency varies based on your usage and reminder settings. You may receive reminder messages, confirmations, and responses to your questions.</li>
                <li><strong>Message and Data Rates:</strong> Standard message and data rates may apply. Check with your wireless carrier for details about your messaging plan.</li>
                <li><strong>Supported Carriers:</strong> The service works with major U.S. wireless carriers. Service may not be available on all carriers.</li>
                <li><strong>Mobile Device Requirements:</strong> You need a compatible mobile device and wireless service plan to use Nell.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Opting Out</h2>
              <p className="mb-4">
                You can stop receiving messages from Nell at any time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Text STOP:</strong> Reply with "STOP" to any message from (279) 529-0731 to immediately unsubscribe</li>
                <li><strong>Text HELP:</strong> Reply with "HELP" for assistance and support information</li>
                <li><strong>Customer Support:</strong> Contact us at lawrencep.design@gmail.com for additional help</li>
              </ul>
              <p>
                After texting STOP, you will receive one final confirmation message, and then no further messages will be sent to your mobile device unless you opt back in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use</h2>
              <p className="mb-4">
                You agree to use Nell only for legitimate personal relationship management purposes. You will not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send spam, abusive, or inappropriate content</li>
                <li>Attempt to hack, disrupt, or interfere with the service</li>
                <li>Use the service for commercial or business purposes without permission</li>
                <li>Share false or misleading information</li>
                <li>Use the service in any way that violates applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p>
                While we strive to provide reliable service, Nell is provided "as is" and we cannot guarantee 100% uptime or delivery of all messages. Service may be temporarily interrupted for maintenance, updates, or due to technical issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Early Access</h2>
              <p>
                Nell is currently in early access. During this period, the service is provided free of charge. We may introduce pricing in the future, and existing users will be notified in advance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <p>
                The Nell service, including its software, design, and content, is owned by Nell and protected by intellectual property laws. You may use the service for personal purposes but may not copy, modify, or distribute our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p>
                <strong>IMPORTANT:</strong> Nell is provided "as is" without warranties of any kind. To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We are not liable for missed reminders or messages</li>
                <li>We are not responsible for the consequences of missed birthdays or events</li>
                <li>Our total liability is limited to the amount you paid for the service (currently $0 during early access)</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
              </ul>
              <p className="mt-4">
                <strong>Use Nell as a helpful tool, but don't rely solely on it for important reminders.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <p>
                Either party may terminate your use of Nell at any time. You can stop using the service by texting STOP. We may terminate or suspend service for violations of these terms or for any other reason with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p>
                We may modify these terms from time to time. If we make material changes, we will notify you via SMS or email. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p>
                These terms are governed by the laws of the United States and the state in which Nell operates, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:lawrencep.design@gmail.com" className="text-[#ff7849] hover:text-[#e56a42] transition-colors">lawrencep.design@gmail.com</a></li>
                <li><strong>Text:</strong> <a href="sms:+12795290731" className="text-[#ff7849] hover:text-[#e56a42] transition-colors">(279) 529-0731</a></li>
                <li><strong>Help Command:</strong> Text "HELP" to (279) 529-0731 for immediate assistance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Severability</h2>
              <p>
                If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}