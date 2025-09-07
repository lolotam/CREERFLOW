'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Plus, X, Upload, Send, Globe } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

interface ApplicationFormProps {
  jobId?: string;
}

export interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  phoneCountryCode: string;
  addressLine1: string;
  addressLine2: string;
  country: string;

  // Experience
  currentPosition: string;
  currentCompany: string;
  yearsExperience: string;
  education: string;
  skills: string[];
  certifications: string[];

  // Documents
  resume: File | null;
  coverLetter: File | null;
  portfolio: File | null;

  // Additional
  availableStartDate: string;
  salaryExpectation: string;
  additionalInfo: string;
  status: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  phoneCountryCode: '+965',
  addressLine1: '',
  addressLine2: '',
  country: 'Kuwait',
  currentPosition: '',
  currentCompany: '',
  yearsExperience: '',
  education: '',
  skills: [],
  certifications: [],
  resume: null,
  coverLetter: null,
  portfolio: null,
  availableStartDate: '',
  salaryExpectation: '',
  additionalInfo: '',
  status: '',
};

const countryCodes = [
  { id: 'AF', code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { id: 'AL', code: '+355', country: 'Albania', flag: '🇦🇱' },
  { id: 'DZ', code: '+213', country: 'Algeria', flag: '🇩🇿' },
  { id: 'AS', code: '+1684', country: 'American Samoa', flag: '🇦🇸' },
  { id: 'AD', code: '+376', country: 'Andorra', flag: '🇦🇩' },
  { id: 'AO', code: '+244', country: 'Angola', flag: '🇦🇴' },
  { id: 'AI', code: '+1264', country: 'Anguilla', flag: '🇦🇮' },
  { id: 'AQ', code: '+672', country: 'Antarctica', flag: '🇦🇶' },
  { id: 'AG', code: '+1268', country: 'Antigua and Barbuda', flag: '🇦🇬' },
  { id: 'AR', code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { id: 'AM', code: '+374', country: 'Armenia', flag: '🇦🇲' },
  { id: 'AW', code: '+297', country: 'Aruba', flag: '🇦🇼' },
  { id: 'AU', code: '+61', country: 'Australia', flag: '🇦🇺' },
  { id: 'AT', code: '+43', country: 'Austria', flag: '🇦🇹' },
  { id: 'AZ', code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
  { id: 'BS', code: '+1242', country: 'Bahamas', flag: '🇧🇸' },
  { id: 'BH', code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { id: 'BD', code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { id: 'BB', code: '+1246', country: 'Barbados', flag: '🇧🇧' },
  { id: 'BY', code: '+375', country: 'Belarus', flag: '🇧🇾' },
  { id: 'BE', code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { id: 'BZ', code: '+501', country: 'Belize', flag: '🇧🇿' },
  { id: 'BJ', code: '+229', country: 'Benin', flag: '🇧🇯' },
  { id: 'BM', code: '+1441', country: 'Bermuda', flag: '🇧🇲' },
  { id: 'BT', code: '+975', country: 'Bhutan', flag: '🇧🇹' },
  { id: 'BO', code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { id: 'BQ', code: '+599', country: 'Bonaire, Sint Eustatius and Saba', flag: '🇧🇶' },
  { id: 'BA', code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { id: 'BW', code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { id: 'BR', code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { id: 'IO', code: '+246', country: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { id: 'VG', code: '+1284', country: 'British Virgin Islands', flag: '🇻🇬' },
  { id: 'BN', code: '+673', country: 'Brunei', flag: '🇧🇳' },
  { id: 'BG', code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
  { id: 'BF', code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { id: 'BI', code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { id: 'CV', code: '+238', country: 'Cabo Verde', flag: '🇨🇻' },
  { id: 'KH', code: '+855', country: 'Cambodia', flag: '🇰🇭' },
  { id: 'CM', code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { id: 'CA', code: '+1', country: 'Canada', flag: '🇨🇦' },
  { id: 'KY', code: '+1345', country: 'Cayman Islands', flag: '🇰🇾' },
  { id: 'CF', code: '+236', country: 'Central African Republic', flag: '🇨🇫' },
  { id: 'TD', code: '+235', country: 'Chad', flag: '🇹🇩' },
  { id: 'CL', code: '+56', country: 'Chile', flag: '🇨🇱' },
  { id: 'CN', code: '+86', country: 'China', flag: '🇨🇳' },
  { id: 'CX', code: '+61', country: 'Christmas Island', flag: '🇨🇽' },
  { id: 'CC', code: '+61', country: 'Cocos (Keeling) Islands', flag: '🇨🇨' },
  { id: 'CO', code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { id: 'KM', code: '+269', country: 'Comoros', flag: '🇰🇲' },
  { id: 'CG', code: '+242', country: 'Congo', flag: '🇨🇬' },
  { id: 'CD', code: '+243', country: 'Congo (Democratic Republic)', flag: '🇨🇩' },
  { id: 'CK', code: '+682', country: 'Cook Islands', flag: '🇨🇰' },
  { id: 'CR', code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { id: 'CI', code: '+225', country: 'Cote d\'Ivoire', flag: '🇨🇮' },
  { id: 'HR', code: '+385', country: 'Croatia', flag: '🇭🇷' },
  { id: 'CU', code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { id: 'CW', code: '+599', country: 'Curaçao', flag: '🇨🇼' },
  { id: 'CY', code: '+357', country: 'Cyprus', flag: '🇨🇾' },
  { id: 'CZ', code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { id: 'DK', code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { id: 'DJ', code: '+253', country: 'Djibouti', flag: '🇩🇯' },
  { id: 'DM', code: '+1767', country: 'Dominica', flag: '🇩🇲' },
  { id: 'DO', code: '+1809', country: 'Dominican Republic', flag: '🇩🇴' },
  { id: 'EC', code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { id: 'EG', code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { id: 'SV', code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { id: 'GQ', code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
  { id: 'ER', code: '+291', country: 'Eritrea', flag: '🇪🇷' },
  { id: 'EE', code: '+372', country: 'Estonia', flag: '🇪🇪' },
  { id: 'SZ', code: '+268', country: 'Eswatini', flag: '🇸🇿' },
  { id: 'ET', code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { id: 'FK', code: '+500', country: 'Falkland Islands', flag: '🇫🇰' },
  { id: 'FO', code: '+298', country: 'Faroe Islands', flag: '🇫🇴' },
  { id: 'FJ', code: '+679', country: 'Fiji', flag: '🇫🇯' },
  { id: 'FI', code: '+358', country: 'Finland', flag: '🇫🇮' },
  { id: 'FR', code: '+33', country: 'France', flag: '🇫🇷' },
  { id: 'GF', code: '+594', country: 'French Guiana', flag: '🇬🇫' },
  { id: 'PF', code: '+689', country: 'French Polynesia', flag: '🇵🇫' },
  { id: 'GA', code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { id: 'GM', code: '+220', country: 'Gambia', flag: '🇬🇲' },
  { id: 'GE', code: '+995', country: 'Georgia', flag: '🇬🇪' },
  { id: 'DE', code: '+49', country: 'Germany', flag: '🇩🇪' },
  { id: 'GH', code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { id: 'GI', code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
  { id: 'GR', code: '+30', country: 'Greece', flag: '🇬🇷' },
  { id: 'GL', code: '+299', country: 'Greenland', flag: '🇬🇱' },
  { id: 'GD', code: '+1473', country: 'Grenada', flag: '🇬🇩' },
  { id: 'GP', code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
  { id: 'GU', code: '+1671', country: 'Guam', flag: '🇬🇺' },
  { id: 'GT', code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { id: 'GG', code: '+44', country: 'Guernsey', flag: '🇬🇬' },
  { id: 'GN', code: '+224', country: 'Guinea', flag: '🇬🇳' },
  { id: 'GW', code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
  { id: 'GY', code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { id: 'HT', code: '+509', country: 'Haiti', flag: '🇭🇹' },
  { id: 'HN', code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { id: 'HK', code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { id: 'HU', code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { id: 'IS', code: '+354', country: 'Iceland', flag: '🇮🇸' },
  { id: 'IN', code: '+91', country: 'India', flag: '🇮🇳' },
  { id: 'ID', code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { id: 'IR', code: '+98', country: 'Iran', flag: '🇮🇷' },
  { id: 'IQ', code: '+964', country: 'Iraq', flag: '🇮🇶' },
  { id: 'IE', code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { id: 'IM', code: '+44', country: 'Isle of Man', flag: '🇮🇲' },
  { id: 'IL', code: '+972', country: 'Israel', flag: '🇮🇱' },
  { id: 'IT', code: '+39', country: 'Italy', flag: '🇮🇹' },
  { id: 'JM', code: '+1876', country: 'Jamaica', flag: '🇯🇲' },
  { id: 'JP', code: '+81', country: 'Japan', flag: '🇯🇵' },
  { id: 'JE', code: '+44', country: 'Jersey', flag: '🇯🇪' },
  { id: 'JO', code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { id: 'KZ', code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
  { id: 'KE', code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { id: 'KI', code: '+686', country: 'Kiribati', flag: '🇰🇮' },
  { id: 'KP', code: '+850', country: 'Korea (North)', flag: '🇰🇵' },
  { id: 'KR', code: '+82', country: 'Korea (South)', flag: '🇰🇷' },
  { id: 'KW', code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { id: 'KG', code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
  { id: 'LA', code: '+856', country: 'Laos', flag: '🇱🇦' },
  { id: 'LV', code: '+371', country: 'Latvia', flag: '🇱🇻' },
  { id: 'LB', code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { id: 'LS', code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { id: 'LR', code: '+231', country: 'Liberia', flag: '🇱🇷' },
  { id: 'LY', code: '+218', country: 'Libya', flag: '🇱🇾' },
  { id: 'LI', code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
  { id: 'LT', code: '+370', country: 'Lithuania', flag: '🇱🇹' },
  { id: 'LU', code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
  { id: 'MO', code: '+853', country: 'Macao', flag: '🇲🇴' },
  { id: 'MK', code: '+389', country: 'Macedonia (North)', flag: '🇲🇰' },
  { id: 'MG', code: '+261', country: 'Madagascar', flag: '🇲🇬' },
  { id: 'MW', code: '+265', country: 'Malawi', flag: '🇲🇼' },
  { id: 'MY', code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { id: 'MV', code: '+960', country: 'Maldives', flag: '🇲🇻' },
  { id: 'ML', code: '+223', country: 'Mali', flag: '🇲🇱' },
  { id: 'MT', code: '+356', country: 'Malta', flag: '🇲🇹' },
  { id: 'MH', code: '+692', country: 'Marshall Islands', flag: '🇲🇭' },
  { id: 'MQ', code: '+596', country: 'Martinique', flag: '🇲🇶' },
  { id: 'MR', code: '+222', country: 'Mauritania', flag: '🇲🇷' },
  { id: 'MU', code: '+230', country: 'Mauritius', flag: '🇲🇺' },
  { id: 'YT', code: '+262', country: 'Mayotte', flag: '🇾🇹' },
  { id: 'MX', code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { id: 'FM', code: '+691', country: 'Micronesia', flag: '🇫🇲' },
  { id: 'MD', code: '+373', country: 'Moldova', flag: '🇲🇩' },
  { id: 'MC', code: '+377', country: 'Monaco', flag: '🇲🇨' },
  { id: 'MN', code: '+976', country: 'Mongolia', flag: '🇲🇳' },
  { id: 'ME', code: '+382', country: 'Montenegro', flag: '🇲🇪' },
  { id: 'MS', code: '+1664', country: 'Montserrat', flag: '🇲🇸' },
  { id: 'MA', code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { id: 'MZ', code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { id: 'MM', code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { id: 'NA', code: '+264', country: 'Namibia', flag: '🇳🇦' },
  { id: 'NR', code: '+674', country: 'Nauru', flag: '🇳🇷' },
  { id: 'NP', code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { id: 'NL', code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { id: 'NC', code: '+687', country: 'New Caledonia', flag: '🇳🇨' },
  { id: 'NZ', code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { id: 'NI', code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { id: 'NE', code: '+227', country: 'Niger', flag: '🇳🇪' },
  { id: 'NG', code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { id: 'NU', code: '+683', country: 'Niue', flag: '🇳🇺' },
  { id: 'NF', code: '+672', country: 'Norfolk Island', flag: '🇳🇫' },
  { id: 'MP', code: '+1670', country: 'Northern Mariana Islands', flag: '🇲🇵' },
  { id: 'NO', code: '+47', country: 'Norway', flag: '🇳🇴' },
  { id: 'OM', code: '+968', country: 'Oman', flag: '🇴🇲' },
  { id: 'PK', code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { id: 'PW', code: '+680', country: 'Palau', flag: '🇵🇼' },
  { id: 'PS', code: '+970', country: 'Palestine', flag: '🇵🇸' },
  { id: 'PA', code: '+507', country: 'Panama', flag: '🇵🇦' },
  { id: 'PG', code: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
  { id: 'PY', code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { id: 'PE', code: '+51', country: 'Peru', flag: '🇵🇪' },
  { id: 'PH', code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { id: 'PN', code: '+64', country: 'Pitcairn', flag: '🇵🇳' },
  { id: 'PL', code: '+48', country: 'Poland', flag: '🇵🇱' },
  { id: 'PT', code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { id: 'PR', code: '+1787', country: 'Puerto Rico', flag: '🇵🇷' },
  { id: 'QA', code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { id: 'RE', code: '+262', country: 'Réunion', flag: '🇷🇪' },
  { id: 'RO', code: '+40', country: 'Romania', flag: '🇷🇴' },
  { id: 'RU', code: '+7', country: 'Russia', flag: '🇷🇺' },
  { id: 'RW', code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { id: 'BL', code: '+590', country: 'Saint Barthélemy', flag: '🇧🇱' },
  { id: 'SH', code: '+290', country: 'Saint Helena', flag: '🇸🇭' },
  { id: 'KN', code: '+1869', country: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { id: 'LC', code: '+1758', country: 'Saint Lucia', flag: '🇱🇨' },
  { id: 'MF', code: '+590', country: 'Saint Martin', flag: '🇲🇫' },
  { id: 'PM', code: '+508', country: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
  { id: 'VC', code: '+1784', country: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { id: 'WS', code: '+685', country: 'Samoa', flag: '🇼🇸' },
  { id: 'SM', code: '+378', country: 'San Marino', flag: '🇸🇲' },
  { id: 'ST', code: '+239', country: 'Sao Tome and Principe', flag: '🇸🇹' },
  { id: 'SA', code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { id: 'SN', code: '+221', country: 'Senegal', flag: '🇸🇳' },
  { id: 'RS', code: '+381', country: 'Serbia', flag: '🇷🇸' },
  { id: 'SC', code: '+248', country: 'Seychelles', flag: '🇸🇨' },
  { id: 'SL', code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
  { id: 'SG', code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { id: 'SX', code: '+1721', country: 'Sint Maarten', flag: '🇸🇽' },
  { id: 'SK', code: '+421', country: 'Slovakia', flag: '🇸🇰' },
  { id: 'SI', code: '+386', country: 'Slovenia', flag: '🇸🇮' },
  { id: 'SB', code: '+677', country: 'Solomon Islands', flag: '🇸🇧' },
  { id: 'SO', code: '+252', country: 'Somalia', flag: '🇸🇴' },
  { id: 'ZA', code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { id: 'GS', code: '+500', country: 'South Georgia and the South Sandwich Islands', flag: '🇬🇸' },
  { id: 'SS', code: '+211', country: 'South Sudan', flag: '🇸🇸' },
  { id: 'ES', code: '+34', country: 'Spain', flag: '🇪🇸' },
  { id: 'LK', code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { id: 'SD', code: '+249', country: 'Sudan', flag: '🇸🇩' },
  { id: 'SR', code: '+597', country: 'Suriname', flag: '🇸🇷' },
  { id: 'SJ', code: '+47', country: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
  { id: 'SE', code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { id: 'CH', code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { id: 'SY', code: '+963', country: 'Syria', flag: '🇸🇾' },
  { id: 'TW', code: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { id: 'TJ', code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
  { id: 'TZ', code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { id: 'TH', code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { id: 'TL', code: '+670', country: 'Timor-Leste', flag: '🇹🇱' },
  { id: 'TG', code: '+228', country: 'Togo', flag: '🇹🇬' },
  { id: 'TK', code: '+690', country: 'Tokelau', flag: '🇹🇰' },
  { id: 'TO', code: '+676', country: 'Tonga', flag: '🇹🇴' },
  { id: 'TT', code: '+1868', country: 'Trinidad and Tobago', flag: '🇹🇹' },
  { id: 'TN', code: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { id: 'TR', code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { id: 'TM', code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
  { id: 'TC', code: '+1649', country: 'Turks and Caicos Islands', flag: '🇹🇨' },
  { id: 'TV', code: '+688', country: 'Tuvalu', flag: '🇹🇻' },
  { id: 'UG', code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { id: 'UA', code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { id: 'AE', code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'GB', code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { id: 'US', code: '+1', country: 'United States', flag: '🇺🇸' },
  { id: 'VI', code: '+1340', country: 'United States Virgin Islands', flag: '🇻🇮' },
  { id: 'UY', code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { id: 'UZ', code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
  { id: 'VU', code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
  { id: 'VA', code: '+379', country: 'Vatican City', flag: '🇻🇦' },
  { id: 'VE', code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { id: 'VN', code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { id: 'WF', code: '+681', country: 'Wallis and Futuna', flag: '🇼🇫' },
  { id: 'EH', code: '+212', country: 'Western Sahara', flag: '🇪🇭' },
  { id: 'YE', code: '+967', country: 'Yemen', flag: '🇾🇪' },
  { id: 'ZM', code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { id: 'ZW', code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
].sort((a, b) => a.country.localeCompare(b.country));

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo (Democratic Republic)',
  'Cook Islands', 'Costa Rica', 'Cote d\'Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
  'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Korea (North)', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

const salaryRanges = [
  '$30,000 - $40,000',
  '$40,000 - $50,000',
  '$50,000 - $60,000',
  '$60,000 - $70,000',
  '$70,000 - $80,000',
  '$80,000 - $90,000',
  '$90,000 - $100,000',
  '$100,000 - $120,000',
  '$120,000 - $150,000',
  '$150,000 - $200,000',
  '$200,000+'
];

const statusOptions = [
  'Actively Looking',
  'Open to Opportunities',
  'Passively Looking',
  'Not Looking',
  'Employed - Available in 30 days',
  'Employed - Available in 60 days',
  'Employed - Available in 90+ days',
  'Student/Recent Graduate',
  'Career Change',
  'Returning to Workforce'
];

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:type;base64, prefix to get just the base64 data
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

export default function SinglePageApplicationForm({ jobId }: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const router = useRouter();
  const t = useTranslations('application');

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      updateFormData({ skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateFormData({ skills: formData.skills.filter(skill => skill !== skillToRemove) });
  };

  const isFormValid = () => {
    return formData.firstName && formData.lastName && formData.email && formData.dateOfBirth &&
           formData.phone && formData.addressLine1 && formData.country && formData.yearsExperience &&
           formData.education && formData.status && formData.resume;
  };

  const submitApplication = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');
    setRetryAfter(null);

    try {
      // Prepare JSON payload with null checks
      const jsonPayload = {
        // Personal Information - ensure all fields are strings
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        dateOfBirth: formData.dateOfBirth || '',
        phone: formData.phone || '',
        phoneCountryCode: formData.phoneCountryCode || '+1',
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2 || '',
        country: formData.country || '',

        // Experience - ensure all fields are strings
        currentPosition: formData.currentPosition || '',
        currentCompany: formData.currentCompany || '',
        yearsExperience: formData.yearsExperience || '',
        education: formData.education || '',
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        certifications: Array.isArray(formData.certifications) ? formData.certifications : [],

        // Additional Information - ensure all fields are strings
        availableStartDate: formData.availableStartDate || '',
        salaryExpectation: formData.salaryExpectation || '',
        additionalInfo: formData.additionalInfo || '',
        status: formData.status || '',

        // Job Information
        jobId: jobId || null,
        submittedAt: new Date().toISOString(),

        // Convert files to base64 for JSON transmission
        resume: formData.resume ? {
          name: formData.resume.name || '',
          size: formData.resume.size || 0,
          type: formData.resume.type || '',
          data: await fileToBase64(formData.resume)
        } : null,
        coverLetter: formData.coverLetter ? {
          name: formData.coverLetter.name || '',
          size: formData.coverLetter.size || 0,
          type: formData.coverLetter.type || '',
          data: await fileToBase64(formData.coverLetter)
        } : null,
        portfolio: formData.portfolio ? {
          name: formData.portfolio.name || '',
          size: formData.portfolio.size || 0,
          type: formData.portfolio.type || '',
          data: await fileToBase64(formData.portfolio)
        } : null,
      };

      // Submit to internal proxy API (which forwards to webhook)
      const response = await fetch('/api/submit-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload),
      });

      // Enhanced error handling for response parsing
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', {
          status: response.status,
          statusText: response.statusText,
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
          responseHeaders: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`Server returned invalid JSON response (${response.status}): ${response.statusText}`);
      }

      if (response.ok && result.success) {
        console.log('Application submitted successfully:', result.data);
        setSubmitStatus('success');

        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push('/thanks');
        }, 1500);
      } else {
        // Enhanced error logging with detailed information
        console.error('Application submission error details:', {
          status: response.status,
          statusText: response.statusText,
          success: result.success,
          message: result.message,
          error: result.error,
          fallbackAction: result.fallbackAction,
          retryAfter: result.retryAfter,
          fullResponse: result
        });

        setSubmitStatus('error');
        setSubmitError(result.message || `Submission failed: ${response.status} ${response.statusText}`);

        // Set retry timer if provided
        if (result.retryAfter) {
          setRetryAfter(result.retryAfter);
          setTimeout(() => setRetryAfter(null), result.retryAfter * 1000);
        }

        throw new Error(result.message || `Submission failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      // Enhanced error logging with detailed debugging information
      console.error('Application submission failed - detailed error:', {
        errorType: error instanceof Error ? 'Error' : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : undefined,
        timestamp: new Date().toISOString(),
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          hasRequiredFields: !!(formData.firstName && formData.lastName && formData.email)
        }
      });

      setSubmitStatus('error');

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMessage);

      // Don't show alert anymore, we'll show inline error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-black text-black mb-2">{t('title')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submitApplication(); }} className="space-y-12">
          {/* Personal Information Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-black mb-6 flex items-center">
              <User size={24} className="mr-3" style={{ color: 'var(--accent-pink)' }} />
              {t('sections.personalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('fields.firstName')} *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.firstName')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('fields.lastName')} *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.lastName')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  <Mail size={16} className="inline mr-2" />
                  {t('fields.email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.email')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  {t('fields.dateOfBirth')} *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.dateOfBirth')}
                  required
                  min="1944-01-01"
                  max="2008-12-31"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  <Globe size={16} className="inline mr-2" />
                  {t('fields.country')} *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    const selectedCountry = e.target.value;
                    handleInputChange('country', selectedCountry);

                    // Auto-populate phone country code based on selected country
                    const countryCodeMapping: { [key: string]: string } = {
                      'Kuwait': '+965',
                      'United Arab Emirates': '+971',
                      'Saudi Arabia': '+966',
                      'Qatar': '+974',
                      'Bahrain': '+973',
                      'Oman': '+968',
                      'Jordan': '+962',
                      'Lebanon': '+961',
                      'Egypt': '+20',
                      'United States': '+1',
                      'United Kingdom': '+44',
                      'Canada': '+1',
                      'Australia': '+61',
                      'India': '+91',
                      'Pakistan': '+92',
                      'Bangladesh': '+880',
                      'Philippines': '+63',
                      'Indonesia': '+62',
                      'Malaysia': '+60',
                      'Singapore': '+65',
                      'Thailand': '+66',
                      'Vietnam': '+84',
                      'South Korea': '+82',
                      'Japan': '+81',
                      'China': '+86',
                      'Turkey': '+90',
                      'Germany': '+49',
                      'France': '+33',
                      'Italy': '+39',
                      'Spain': '+34',
                      'Netherlands': '+31',
                      'Belgium': '+32',
                      'Switzerland': '+41',
                      'Austria': '+43',
                      'Sweden': '+46',
                      'Norway': '+47',
                      'Denmark': '+45',
                      'Finland': '+358',
                      'Poland': '+48',
                      'Czech Republic': '+420',
                      'Hungary': '+36',
                      'Romania': '+40',
                      'Bulgaria': '+359',
                      'Greece': '+30',
                      'Cyprus': '+357',
                      'Malta': '+356',
                      'Ireland': '+353',
                      'Portugal': '+351',
                      'Luxembourg': '+352',
                      'Iceland': '+354',
                      'Estonia': '+372',
                      'Latvia': '+371',
                      'Lithuania': '+370',
                      'Slovenia': '+386',
                      'Slovakia': '+421',
                      'Croatia': '+385',
                      'Serbia': '+381',
                      'Montenegro': '+382',
                      'Bosnia and Herzegovina': '+387',
                      'North Macedonia': '+389',
                      'Albania': '+355',
                      'Moldova': '+373',
                      'Ukraine': '+380',
                      'Belarus': '+375',
                      'Russia': '+7',
                      'Georgia': '+995',
                      'Armenia': '+374',
                      'Azerbaijan': '+994',
                      'Kazakhstan': '+7',
                      'Uzbekistan': '+998',
                      'Kyrgyzstan': '+996',
                      'Tajikistan': '+992',
                      'Turkmenistan': '+993',
                      'Afghanistan': '+93',
                      'Iran': '+98',
                      'Iraq': '+964',
                      'Syria': '+963',
                      'Yemen': '+967',
                      'Israel': '+972',
                      'Palestine': '+970',
                      'Morocco': '+212',
                      'Algeria': '+213',
                      'Tunisia': '+216',
                      'Libya': '+218',
                      'Sudan': '+249',
                      'South Sudan': '+211',
                      'Ethiopia': '+251',
                      'Kenya': '+254',
                      'Uganda': '+256',
                      'Tanzania': '+255',
                      'Rwanda': '+250',
                      'Burundi': '+257',
                      'Somalia': '+252',
                      'Djibouti': '+253',
                      'Eritrea': '+291',
                      'South Africa': '+27',
                      'Nigeria': '+234',
                      'Ghana': '+233',
                      'Ivory Coast': '+225',
                      'Senegal': '+221',
                      'Mali': '+223',
                      'Burkina Faso': '+226',
                      'Niger': '+227',
                      'Chad': '+235',
                      'Cameroon': '+237',
                      'Central African Republic': '+236',
                      'Democratic Republic of Congo': '+243',
                      'Republic of Congo': '+242',
                      'Gabon': '+241',
                      'Equatorial Guinea': '+240',
                      'Sao Tome and Principe': '+239',
                      'Cape Verde': '+238',
                      'Guinea-Bissau': '+245',
                      'Guinea': '+224',
                      'Sierra Leone': '+232',
                      'Liberia': '+231',
                      'Mauritania': '+222',
                      'Gambia': '+220',
                      'Botswana': '+267',
                      'Namibia': '+264',
                      'Zambia': '+260',
                      'Zimbabwe': '+263',
                      'Malawi': '+265',
                      'Mozambique': '+258',
                      'Madagascar': '+261',
                      'Mauritius': '+230',
                      'Seychelles': '+248',
                      'Comoros': '+269',
                      'Mayotte': '+262',
                      'Reunion': '+262',
                      'Brazil': '+55',
                      'Argentina': '+54',
                      'Chile': '+56',
                      'Peru': '+51',
                      'Colombia': '+57',
                      'Venezuela': '+58',
                      'Ecuador': '+593',
                      'Bolivia': '+591',
                      'Paraguay': '+595',
                      'Uruguay': '+598',
                      'Guyana': '+592',
                      'Suriname': '+597',
                      'French Guiana': '+594',
                      'Mexico': '+52',
                      'Guatemala': '+502',
                      'Belize': '+501',
                      'El Salvador': '+503',
                      'Honduras': '+504',
                      'Nicaragua': '+505',
                      'Costa Rica': '+506',
                      'Panama': '+507',
                      'Cuba': '+53',
                      'Jamaica': '+1876',
                      'Haiti': '+509',
                      'Dominican Republic': '+1809',
                      'Puerto Rico': '+1787',
                      'Trinidad and Tobago': '+1868',
                      'Barbados': '+1246',
                      'Saint Lucia': '+1758',
                      'Grenada': '+1473',
                      'Saint Vincent and the Grenadines': '+1784',
                      'Antigua and Barbuda': '+1268',
                      'Dominica': '+1767',
                      'Saint Kitts and Nevis': '+1869',
                      'Bahamas': '+1242',
                      'Fiji': '+679',
                      'Papua New Guinea': '+675',
                      'New Zealand': '+64',
                      'Vanuatu': '+678',
                      'Solomon Islands': '+677',
                      'New Caledonia': '+687',
                      'French Polynesia': '+689',
                      'Samoa': '+685',
                      'Tonga': '+676',
                      'Kiribati': '+686',
                      'Palau': '+680',
                      'Marshall Islands': '+692',
                      'Micronesia': '+691',
                      'Nauru': '+674',
                      'Tuvalu': '+688'
                    };

                    const phoneCode = countryCodeMapping[selectedCountry];
                    if (phoneCode) {
                      handleInputChange('phoneCountryCode', phoneCode);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  required
                >
                  <option value="">{t('options.selectCountry')}</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  <Phone size={16} className="inline mr-2" />
                  {t('fields.phone')} *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={formData.phoneCountryCode}
                    onChange={(e) => handleInputChange('phoneCountryCode', e.target.value)}
                    className="px-3 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.id} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                    placeholder="123-456-7890"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  {t('fields.addressLine1')} *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.addressLine1')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.addressLine2')}</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
                  placeholder={t('placeholders.addressLine2')}
                />
              </div>


            </div>
          </motion.section>

          {/* Experience Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-black mb-6 flex items-center">
              <Briefcase size={24} className="mr-3" style={{ color: 'var(--accent-blue)' }} />
              {t('sections.experienceSkills')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.currentPosition')}</label>
                <input
                  type="text"
                  value={formData.currentPosition}
                  onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
                  placeholder={t('placeholders.currentPosition')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.currentCompany')}</label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
                  placeholder={t('placeholders.currentCompany')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.yearsExperience')} *</label>
                <select
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
                  required
                >
                  <option value="">{t('options.selectExperience')}</option>
                  <option value="0-1">{t('experience.0-1')}</option>
                  <option value="2-5">{t('experience.2-5')}</option>
                  <option value="6-10">{t('experience.6-10')}</option>
                  <option value="10+">{t('experience.10+')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  <GraduationCap size={16} className="inline mr-2" />
                  {t('fields.educationLevel')} *
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
                  required
                >
                  <option value="">{t('options.selectEducation')}</option>
                  <option value="high-school">{t('education.highSchool')}</option>
                  <option value="associate">{t('education.associate')}</option>
                  <option value="bachelor">{t('education.bachelor')}</option>
                  <option value="master">{t('education.master')}</option>
                  <option value="doctorate">{t('education.doctorate')}</option>
                </select>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-black mb-2">
                <Award size={16} className="inline mr-2" />
                {t('fields.skills')}
              </label>
              
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
                  placeholder={t('placeholders.skillInput')}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSkill}
                  className="px-4 py-3 rounded-xl text-black font-bold transition-colors"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <motion.span
                    key={`skill-${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-black px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    style={{ backgroundColor: 'var(--accent-blue)' }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-black hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Documents Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-black mb-6 flex items-center">
              <Upload size={24} className="mr-3" style={{ color: 'var(--accent-green)' }} />
              {t('sections.documents')}
            </h3>
            
            <div className="space-y-8">
              <FileUpload
                label={t('fields.resume')}
                description={t('documents.resumeDescription')}
                onFileSelect={(file) => updateFormData({ resume: file })}
                currentFile={formData.resume}
                acceptedTypes={['.pdf', '.doc', '.docx']}
                maxSize={10}
                required
              />

              <FileUpload
                label={t('fields.coverLetter')}
                description={t('documents.coverLetterDescription')}
                onFileSelect={(file) => updateFormData({ coverLetter: file })}
                currentFile={formData.coverLetter}
                acceptedTypes={['.pdf', '.doc', '.docx']}
                maxSize={5}
              />

              <FileUpload
                label={t('fields.portfolio')}
                description={t('documents.portfolioDescription')}
                onFileSelect={(file) => updateFormData({ portfolio: file })}
                currentFile={formData.portfolio}
                acceptedTypes={['.pdf', '.zip', '.doc', '.docx']}
                maxSize={20}
              />
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-black mb-6">{t('sections.additionalInfo')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.availableStartDate')}</label>
                <input
                  type="date"
                  value={formData.availableStartDate}
                  onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-green)' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">{t('fields.salaryExpectation')}</label>
                <select
                  value={formData.salaryExpectation}
                  onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-green)' } as React.CSSProperties}
                >
                  <option value="">{t('options.selectSalaryRange')}</option>
                  {salaryRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">{t('fields.status')} *</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{ '--tw-ring-color': 'var(--accent-green)' } as React.CSSProperties}
                  required
                >
                  <option value="">{t('options.selectStatus')}</option>
                  {statusOptions.map((status) => {
                    const statusKey = status === 'Actively Looking' ? 'activelyLooking' :
                                    status === 'Open to Opportunities' ? 'openToOpportunities' :
                                    status === 'Passively Looking' ? 'passivelyLooking' :
                                    status === 'Not Looking' ? 'notLooking' :
                                    status === 'Employed - Available in 30 days' ? 'employed30' :
                                    status === 'Employed - Available in 60 days' ? 'employed60' :
                                    status === 'Employed - Available in 90+ days' ? 'employed90' :
                                    status === 'Student/Recent Graduate' ? 'student' :
                                    status === 'Career Change' ? 'careerChange' :
                                    status === 'Returning to Workforce' ? 'returning' : status;
                    return (
                      <option key={status} value={status}>
                        {t(`status.${statusKey}`)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-black mb-2">{t('fields.additionalInfo')}</label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
                style={{ '--tw-ring-color': 'var(--accent-green)' } as React.CSSProperties}
                placeholder={t('placeholders.additionalInfo')}
              />
            </div>
          </motion.section>

          {/* Validation Message */}
          {!isFormValid() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-xl p-4"
            >
              <p className="text-black text-sm">
                {t('messages.requiredFields')}
              </p>
            </motion.div>
          )}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-300 font-medium">
                  Application submitted successfully! Redirecting to confirmation page...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && submitError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-300 font-medium mb-2">Application Submission Failed</p>
                  <p className="text-red-200 text-sm mb-3">{submitError}</p>
                  {retryAfter && (
                    <p className="text-red-200 text-xs mb-3">
                      Please wait {retryAfter} seconds before trying again.
                    </p>
                  )}
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-red-200 text-xs mb-3 opacity-75">
                      Development: Check console for detailed error information
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitStatus('idle');
                      setSubmitError('');
                      setRetryAfter(null);
                    }}
                    className="text-red-300 hover:text-red-100 text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center pt-6"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isFormValid() || isSubmitting || (retryAfter !== null && retryAfter > 0)}
              className="btn-primary px-12 py-4 text-lg font-bold flex items-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : retryAfter !== null && retryAfter > 0 ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Please wait {retryAfter}s</span>
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span>Retry Application</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>{t('buttons.submit')}</span>
                </>
              )}
            </motion.button>
            
            <p className="text-sm text-gray-400 mt-4">
              Your application will be submitted securely and you&apos;ll receive a confirmation email.
            </p>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
