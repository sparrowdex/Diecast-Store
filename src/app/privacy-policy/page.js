import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Disclaimer</p>
          <p>This is a placeholder for your Privacy Policy. You should replace this text with a policy written by a legal professional to ensure it complies with all applicable laws and regulations.</p>
        </div>

        <p>Last updated: January 07, 2026</p>

        <h2 className="text-2xl font-semibold mt-6">Introduction</h2>
        <p>
          Welcome to Diecast-Store. We are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Diecast-Store.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul>
            <li>Create and manage your account.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
            <li>Process payments and refunds.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <p>
          Diecast-Store<br/>
          [Your Contact Information Here]<br/>
          [Your Email Address Here]
        </p>
      </div>
    </div>
  );
}
