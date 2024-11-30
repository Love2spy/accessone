import React from 'react';
import { Book, FileText, CheckSquare, DollarSign, Users, AlertCircle, ExternalLink, Globe, PlayCircle, Search, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function Resources() {
  const quickLinks = [
    {
      title: 'SBA Certifications Portal',
      url: 'https://certifications.sba.gov',
      description: 'Apply for Small Business Certifications',
      icon: <Award className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Federal Procurement Data System',
      url: 'https://www.fpds.gov',
      description: 'Find Previous Contract Awards',
      icon: <Globe className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'SAM.gov',
      url: 'https://sam.gov',
      description: 'Search Contract Opportunities',
      icon: <Search className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Top-10 Websites Video',
      url: 'https://youtu.be/Y_HD0UWYQRo',
      description: 'Essential Government Contracting Resources',
      icon: <PlayCircle className="w-5 h-5 text-blue-500" />
    }
  ];

  const governmentWebsites = [
    {
      title: 'SBA Certifications Portal',
      url: 'https://certifications.sba.gov',
      description: 'Official Portal for Small Business Certifications'
    },
    {
      title: 'Federal Procurement Data System',
      url: 'https://www.fpds.gov',
      description: 'Next Generation Contract Awards Database'
    },
    {
      title: 'Small Business Administration',
      url: 'https://www.sba.gov',
      description: 'Contracting Starter Guide'
    },
    {
      title: 'USAspending',
      url: 'https://www.usaspending.gov',
      description: 'Research Spending by Industry'
    },
    {
      title: 'Unison Marketplace',
      url: 'https://www.unisonglobal.com',
      description: 'Product Bids Platform'
    },
    {
      title: 'APTAC',
      url: 'https://www.aptac-us.org',
      description: 'Procurement Technical Assistance'
    },
    {
      title: 'OSDBU',
      url: 'https://www.osdbu.gov',
      description: 'Office of Small & Disadvantaged Business Utilization'
    },
    {
      title: 'Acquisition.GOV',
      url: 'https://www.acquisition.gov',
      description: 'Procurement Forecast and Regulations'
    },
    {
      title: 'eCFR',
      url: 'https://www.ecfr.gov',
      description: 'Electronic Code of Federal Regulations'
    },
    {
      title: 'GSA eLibrary',
      url: 'https://www.gsaelibrary.gsa.gov',
      description: 'Published Pricing Catalogs'
    },
    {
      title: 'SAM.gov',
      url: 'https://sam.gov',
      description: 'Contract Opportunities Portal'
    }
  ];

  const setAsidePrograms = [
    {
      title: 'SD(VOSB) Program',
      description: 'Service-Disabled Veteran-Owned Small Business Program',
      links: [
        {
          title: 'Program Information',
          url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/veteran-assistance-programs'
        },
        {
          title: 'Apply for Certification',
          url: 'https://veterans.certify.sba.gov'
        }
      ]
    },
    {
      title: '8(a) Business Development',
      description: 'Socially and economically disadvantaged business program',
      links: [
        {
          title: 'Program Information',
          url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program'
        },
        {
          title: 'Apply for Certification',
          url: 'https://certify.sba.gov'
        }
      ]
    },
    {
      title: 'WOSB/EDWOSB Program',
      description: 'Women-Owned Small Business Federal Contract Program',
      links: [
        {
          title: 'Program Information',
          url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/women-owned-small-business-federal-contracting-program'
        },
        {
          title: 'Apply for Certification',
          url: 'https://certify.sba.gov'
        }
      ]
    },
    {
      title: 'HUBZone Program',
      description: 'Historically Underutilized Business Zone Program',
      links: [
        {
          title: 'Program Information',
          url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program'
        },
        {
          title: 'Application Guide',
          url: 'https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program/how-apply'
        }
      ]
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Resources</h1>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <ExternalLink className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Quick Links</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-duration-150"
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <div>
                  <h3 className="font-semibold">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Set-Aside Programs */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Set-Aside Programs</h2>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            Federally recognized set-asides include 8(a), HUBZone, SD(VOSB), ED(WOSB), and Total Small Business.
            Total Business is the only set-aside that you do not need to obtain a special certification for.
            It's recommended that new contractors get started learning how to bid and win their first 12 months,
            and then grow into additional set-aside programs after that.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {setAsidePrograms.map((program, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <div className="space-y-2">
                {program.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    {link.title} →
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Websites */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Government Websites</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {governmentWebsites.map((site, index) => (
            <a
              key={index}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-duration-150"
            >
              <h3 className="font-semibold">{site.title}</h3>
              <p className="text-sm text-gray-600">{site.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resources;