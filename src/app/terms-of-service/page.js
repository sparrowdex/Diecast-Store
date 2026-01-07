import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Disclaimer</p>
          <p>This is a placeholder for your Terms of Service. You should replace this text with a document written by a legal professional to ensure it is tailored to your business and jurisdiction.</p>
        </div>

        <p>Last updated: January 07, 2026</p>

        <h2 className="text-2xl font-semibold mt-6">1. Agreement to Terms</h2>
        <p>
          By using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6">2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6">3. User Representations</h2>
        <p>
          By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6">4. Prohibited Activities</h2>
        <p>
          You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6">5. Governing Law</h2>
        <p>
          These conditions are governed by and interpreted following the laws of India, and the use of the United Nations Convention of Contracts for the International Sale of Goods is expressly excluded.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>
          In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br/>
          Diecast-Store<br/>
          [Your Contact Information Here]<br/>
          [Your Email Address Here]
        </p>
      </div>
    </div>
  );
}
