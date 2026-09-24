import { 
  FileText, 
  ShieldCheck, 
  HardDrive, 
  Key, 
  Share2, 
  Trash2, 
  Lock, 
  UserCheck, 
  Mail, 
  Globe, 
  Bell, 
  Camera 
} from 'lucide-react';

function PrivacyNotes() {
  const lastUpdated = "March 2026";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Notes App Privacy Policy
              </h1>
              <p className="text-amber-100 text-sm sm:text-base mt-1">
                Privacy Policy for Notes Android Application • Last Updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8 text-gray-700">
          {/* Summary Box */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
            <p className="text-amber-900 font-medium text-base sm:text-lg leading-relaxed">
              Your privacy is fundamental to us. The <strong>Notes Android App</strong> is designed as an offline-first mobile application. We do not collect, sell, or transmit your private notes, lists, or personal data to any external servers.
            </p>
          </div>

          {/* Section 1: Data We Collect */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">1. Information Collection and Use</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We operate under a strict zero-data-collection philosophy for your created content:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Note Content:</strong> All text notes, checklists, titles, and creation timestamps remain exclusively on your Android device.
                </div>
              </li>
              <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Personal Information:</strong> We do not ask for or collect your name, email address, phone number, or account credentials.
                </div>
              </li>
              <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Location Data:</strong> The app does not track, record, or request access to your GPS or precise location.
                </div>
              </li>
              <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-amber-500 font-bold">•</span>
                <div>
                  <strong className="text-gray-900">Usage Analytics:</strong> No telemetry, behavioral tracking, or analytics identifiers are uploaded to external tracking servers.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 2: Storage & Security */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <HardDrive className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">2. Local Storage and Data Security</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your notes are saved locally on your Android device using Android&apos;s standard secure application storage (SQLite database / Room / SharedPreferences).
            </p>
            <div className="bg-blue-50/60 p-4 rounded-xl space-y-2 border border-blue-100">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>On-Device Protection</span>
              </div>
              <p className="text-sm text-blue-800">
                Because all data is stored inside your app&apos;s private sandbox directory, other applications on your device cannot access your notes without your explicit permission. You maintain complete physical and digital control of your notes.
              </p>
            </div>
          </section>

          {/* Section 3: Android Permissions */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">3. Android Permissions Required</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To provide essential note-taking features, the Notes app may request the following system permissions on your Android device:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
                <Bell className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block">Notifications & Alarms (Optional)</strong>
                  <span className="text-sm text-gray-600">
                    Used solely to deliver scheduled note reminders and task notifications set by you.
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start space-x-3">
                <Camera className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block">Storage & Media Access (Optional)</strong>
                  <span className="text-sm text-gray-600">
                    Used only when you explicitly export/import note backups or attach photos/documents to a note.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Data Sharing */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Share2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">4. Data Sharing & Third-Party Services</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, trade, rent, or share any of your personal data or notes with third parties.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>No Commercial Monetization:</strong> Your data is never sold or used for targeted advertising.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>Android System APIs:</strong> The application relies on Google Play Services and core Android OS APIs standard for running Android apps securely.</span>
              </li>
            </ul>
          </section>

          {/* Section 5: User Control & Deletion */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">5. User Control & Data Retention</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              You possess full ownership and control over your data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-1">Deleting Notes</h3>
                <p className="text-sm text-gray-600">
                  Deleting a note within the app permanently removes it from your device storage immediately.
                </p>
              </div>
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-1">Uninstalling the App</h3>
                <p className="text-sm text-gray-600">
                  Uninstalling the application or clearing app storage in Android Settings permanently wipes all saved notes and settings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Children's Privacy */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-900">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">6. Children&apos;s Privacy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our Notes app is suitable for general audiences of all ages. Because we do not collect personal identifiable information from any user, we comply with the Children&apos;s Online Privacy Protection Act (COPPA) and GDPR regulations.
            </p>
          </section>

          {/* Section 7: Policy Updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update our Privacy Policy from time to time. Any changes will be reflected on this page with an updated &quot;Last Updated&quot; date. We encourage users to check this page periodically for any updates.
            </p>
          </section>

          {/* Section 8: Contact Info */}
          <section className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Mail className="w-6 h-6 text-amber-600" />
              <span>Contact Us</span>
            </h2>
            <p className="text-gray-600">
              If you have any questions or suggestions about this Privacy Policy or the Notes Android Application, feel free to reach out:
            </p>
            <div className="space-y-2 pt-1 text-sm sm:text-base">
              <div className="flex items-center space-x-3 text-gray-800">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>Email: </span>
                <a 
                  href="mailto:bipinshrestha830@gmail.com" 
                  className="text-amber-600 hover:text-amber-700 font-semibold underline"
                >
                  bipinshrestha830@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <Globe className="w-5 h-5 text-gray-500" />
                <span>Website: </span>
                <a 
                  href="https://bipinshrestha01.com.np" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 font-semibold underline"
                >
                  https://bipinshrestha01.com.np
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyNotes;
