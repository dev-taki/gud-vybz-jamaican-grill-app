'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Users, Calendar, CreditCard, X, Save, User, DollarSign } from 'lucide-react';
import { AdminAuthService } from '../../services/adminAuthService';
import { AuthService } from '../../services/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllUserSubscriptions } from '../../store/slices/adminSlice';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminHeader from '../../components/AdminHeader';
import { CardLoader, ButtonLoader, InlineLoader } from '../../components/common/Loader';
import { showToast } from '../../utils/toast';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { COLORS } from '../../config/colors';

const BUSINESS_ID = AuthService.getBusinessId();

const SQUARE_CONFIG = {
  applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!,
  locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
};

const COUNTRIES = [
  { value: '', label: '-- Please choose a country --' },
  { value: 'AD', label: 'AD - Andorra' },
  { value: 'AE', label: 'AE - United Arab Emirates' },
  { value: 'AF', label: 'AF - Afghanistan' },
  { value: 'AG', label: 'AG - Antigua and Barbuda' },
  { value: 'AI', label: 'AI - Anguilla' },
  { value: 'AL', label: 'AL - Albania' },
  { value: 'AM', label: 'AM - Armenia' },
  { value: 'AO', label: 'AO - Angola' },
  { value: 'AQ', label: 'AQ - Antarctica' },
  { value: 'AR', label: 'AR - Argentina' },
  { value: 'AS', label: 'AS - American Samoa' },
  { value: 'AT', label: 'AT - Austria' },
  { value: 'AU', label: 'AU - Australia' },
  { value: 'AW', label: 'AW - Aruba' },
  { value: 'AX', label: 'AX - Åland Islands' },
  { value: 'AZ', label: 'AZ - Azerbaijan' },
  { value: 'BA', label: 'BA - Bosnia and Herzegovina' },
  { value: 'BB', label: 'BB - Barbados' },
  { value: 'BD', label: 'BD - Bangladesh' },
  { value: 'BE', label: 'BE - Belgium' },
  { value: 'BF', label: 'BF - Burkina Faso' },
  { value: 'BG', label: 'BG - Bulgaria' },
  { value: 'BH', label: 'BH - Bahrain' },
  { value: 'BI', label: 'BI - Burundi' },
  { value: 'BJ', label: 'BJ - Benin' },
  { value: 'BL', label: 'BL - Saint Barthélemy' },
  { value: 'BM', label: 'BM - Bermuda' },
  { value: 'BN', label: 'BN - Brunei' },
  { value: 'BO', label: 'BO - Bolivia' },
  { value: 'BQ', label: 'BQ - Bonaire' },
  { value: 'BR', label: 'BR - Brazil' },
  { value: 'BS', label: 'BS - Bahamas' },
  { value: 'BT', label: 'BT - Bhutan' },
  { value: 'BV', label: 'BV - Bouvet Island' },
  { value: 'BW', label: 'BW - Botswana' },
  { value: 'BY', label: 'BY - Belarus' },
  { value: 'BZ', label: 'BZ - Belize' },
  { value: 'CA', label: 'CA - Canada' },
  { value: 'CC', label: 'CC - Cocos Islands' },
  { value: 'CD', label: 'CD - Democratic Republic of the Congo' },
  { value: 'CF', label: 'CF - Central African Republic' },
  { value: 'CG', label: 'CG - Congo' },
  { value: 'CH', label: 'CH - Switzerland' },
  { value: 'CI', label: 'CI - Ivory Coast' },
  { value: 'CK', label: 'CK - Cook Islands' },
  { value: 'CL', label: 'CL - Chile' },
  { value: 'CM', label: 'CM - Cameroon' },
  { value: 'CN', label: 'CN - China' },
  { value: 'CO', label: 'CO - Colombia' },
  { value: 'CR', label: 'CR - Costa Rica' },
  { value: 'CU', label: 'CU - Cuba' },
  { value: 'CV', label: 'CV - Cabo Verde' },
  { value: 'CW', label: 'CW - Curaçao' },
  { value: 'CX', label: 'CX - Christmas Island' },
  { value: 'CY', label: 'CY - Cyprus' },
  { value: 'CZ', label: 'CZ - Czechia' },
  { value: 'DE', label: 'DE - Germany' },
  { value: 'DJ', label: 'DJ - Djibouti' },
  { value: 'DK', label: 'DK - Denmark' },
  { value: 'DM', label: 'DM - Dominica' },
  { value: 'DO', label: 'DO - Dominican Republic' },
  { value: 'DZ', label: 'DZ - Algeria' },
  { value: 'EC', label: 'EC - Ecuador' },
  { value: 'EE', label: 'EE - Estonia' },
  { value: 'EG', label: 'EG - Egypt' },
  { value: 'EH', label: 'EH - Western Sahara' },
  { value: 'ER', label: 'ER - Eritrea' },
  { value: 'ES', label: 'ES - Spain' },
  { value: 'ET', label: 'ET - Ethiopia' },
  { value: 'FI', label: 'FI - Finland' },
  { value: 'FJ', label: 'FJ - Fiji' },
  { value: 'FK', label: 'FK - Falkland Islands' },
  { value: 'FM', label: 'FM - Federated States of Micronesia' },
  { value: 'FO', label: 'FO - Faroe Islands' },
  { value: 'FR', label: 'FR - France' },
  { value: 'GA', label: 'GA - Gabon' },
  { value: 'GB', label: 'GB - United Kingdom' },
  { value: 'GD', label: 'GD - Grenada' },
  { value: 'GE', label: 'GE - Georgia' },
  { value: 'GF', label: 'GF - French Guiana' },
  { value: 'GG', label: 'GG - Guernsey' },
  { value: 'GH', label: 'GH - Ghana' },
  { value: 'GI', label: 'GI - Gibraltar' },
  { value: 'GL', label: 'GL - Greenland' },
  { value: 'GM', label: 'GM - Gambia' },
  { value: 'GN', label: 'GN - Guinea' },
  { value: 'GP', label: 'GP - Guadeloupe' },
  { value: 'GQ', label: 'GQ - Equatorial Guinea' },
  { value: 'GR', label: 'GR - Greece' },
  { value: 'GS', label: 'GS - South Georgia' },
  { value: 'GT', label: 'GT - Guatemala' },
  { value: 'GU', label: 'GU - Guam' },
  { value: 'GW', label: 'GW - Guinea-Bissau' },
  { value: 'GY', label: 'GY - Guyana' },
  { value: 'HK', label: 'HK - Hong Kong' },
  { value: 'HM', label: 'HM - Heard Island' },
  { value: 'HN', label: 'HN - Honduras' },
  { value: 'HR', label: 'HR - Croatia' },
  { value: 'HT', label: 'HT - Haiti' },
  { value: 'HU', label: 'HU - Hungary' },
  { value: 'ID', label: 'ID - Indonesia' },
  { value: 'IE', label: 'IE - Ireland' },
  { value: 'IL', label: 'IL - Israel' },
  { value: 'IM', label: 'IM - Isle of Man' },
  { value: 'IN', label: 'IN - India' },
  { value: 'IO', label: 'IO - British Indian Ocean Territory' },
  { value: 'IQ', label: 'IQ - Iraq' },
  { value: 'IR', label: 'IR - Iran' },
  { value: 'IS', label: 'IS - Iceland' },
  { value: 'IT', label: 'IT - Italy' },
  { value: 'JE', label: 'JE - Jersey' },
  { value: 'JM', label: 'JM - Jamaica' },
  { value: 'JO', label: 'JO - Jordan' },
  { value: 'JP', label: 'JP - Japan' },
  { value: 'KE', label: 'KE - Kenya' },
  { value: 'KG', label: 'KG - Kyrgyzstan' },
  { value: 'KH', label: 'KH - Cambodia' },
  { value: 'KI', label: 'KI - Kiribati' },
  { value: 'KM', label: 'KM - Comoros' },
  { value: 'KN', label: 'KN - Saint Kitts and Nevis' },
  { value: 'KP', label: 'KP - North Korea' },
  { value: 'KR', label: 'KR - South Korea' },
  { value: 'KW', label: 'KW - Kuwait' },
  { value: 'KY', label: 'KY - Cayman Islands' },
  { value: 'KZ', label: 'KZ - Kazakhstan' },
  { value: 'LA', label: 'LA - Laos' },
  { value: 'LB', label: 'LB - Lebanon' },
  { value: 'LC', label: 'LC - Saint Lucia' },
  { value: 'LI', label: 'LI - Liechtenstein' },
  { value: 'LK', label: 'LK - Sri Lanka' },
  { value: 'LR', label: 'LR - Liberia' },
  { value: 'LS', label: 'LS - Lesotho' },
  { value: 'LT', label: 'LT - Lithuania' },
  { value: 'LU', label: 'LU - Luxembourg' },
  { value: 'LV', label: 'LV - Latvia' },
  { value: 'LY', label: 'LY - Libya' },
  { value: 'MA', label: 'MA - Morocco' },
  { value: 'MC', label: 'MC - Monaco' },
  { value: 'MD', label: 'MD - Moldova' },
  { value: 'ME', label: 'ME - Montenegro' },
  { value: 'MF', label: 'MF - Saint Martin' },
  { value: 'MG', label: 'MG - Madagascar' },
  { value: 'MH', label: 'MH - Marshall Islands' },
  { value: 'MK', label: 'MK - North Macedonia' },
  { value: 'ML', label: 'ML - Mali' },
  { value: 'MM', label: 'MM - Myanmar' },
  { value: 'MN', label: 'MN - Mongolia' },
  { value: 'MO', label: 'MO - Macao' },
  { value: 'MP', label: 'MP - Northern Mariana Islands' },
  { value: 'MQ', label: 'MQ - Martinique' },
  { value: 'MR', label: 'MR - Mauritania' },
  { value: 'MS', label: 'MS - Montserrat' },
  { value: 'MT', label: 'MT - Malta' },
  { value: 'MU', label: 'MU - Mauritius' },
  { value: 'MV', label: 'MV - Maldives' },
  { value: 'MW', label: 'MW - Malawi' },
  { value: 'MX', label: 'MX - Mexico' },
  { value: 'MY', label: 'MY - Malaysia' },
  { value: 'MZ', label: 'MZ - Mozambique' },
  { value: 'NA', label: 'NA - Namibia' },
  { value: 'NC', label: 'NC - New Caledonia' },
  { value: 'NE', label: 'NE - Niger' },
  { value: 'NF', label: 'NF - Norfolk Island' },
  { value: 'NG', label: 'NG - Nigeria' },
  { value: 'NI', label: 'NI - Nicaragua' },
  { value: 'NL', label: 'NL - Netherlands' },
  { value: 'NO', label: 'NO - Norway' },
  { value: 'NP', label: 'NP - Nepal' },
  { value: 'NR', label: 'NR - Nauru' },
  { value: 'NU', label: 'NU - Niue' },
  { value: 'NZ', label: 'NZ - New Zealand' },
  { value: 'OM', label: 'OM - Oman' },
  { value: 'PA', label: 'PA - Panama' },
  { value: 'PE', label: 'PE - Peru' },
  { value: 'PF', label: 'PF - French Polynesia' },
  { value: 'PG', label: 'PG - Papua New Guinea' },
  { value: 'PH', label: 'PH - Philippines' },
  { value: 'PK', label: 'PK - Pakistan' },
  { value: 'PL', label: 'PL - Poland' },
  { value: 'PM', label: 'PM - Saint Pierre and Miquelon' },
  { value: 'PN', label: 'PN - Pitcairn' },
  { value: 'PR', label: 'PR - Puerto Rico' },
  { value: 'PS', label: 'PS - Palestine' },
  { value: 'PT', label: 'PT - Portugal' },
  { value: 'PW', label: 'PW - Palau' },
  { value: 'PY', label: 'PY - Paraguay' },
  { value: 'QA', label: 'QA - Qatar' },
  { value: 'RE', label: 'RE - Réunion' },
  { value: 'RO', label: 'RO - Romania' },
  { value: 'RS', label: 'RS - Serbia' },
  { value: 'RU', label: 'RU - Russia' },
  { value: 'RW', label: 'RW - Rwanda' },
  { value: 'SA', label: 'SA - Saudi Arabia' },
  { value: 'SB', label: 'SB - Solomon Islands' },
  { value: 'SC', label: 'SC - Seychelles' },
  { value: 'SD', label: 'SD - Sudan' },
  { value: 'SE', label: 'SE - Sweden' },
  { value: 'SG', label: 'SG - Singapore' },
  { value: 'SH', label: 'SH - Saint Helena' },
  { value: 'SI', label: 'SI - Slovenia' },
  { value: 'SJ', label: 'SJ - Svalbard and Jan Mayen' },
  { value: 'SK', label: 'SK - Slovakia' },
  { value: 'SL', label: 'SL - Sierra Leone' },
  { value: 'SM', label: 'SM - San Marino' },
  { value: 'SN', label: 'SN - Senegal' },
  { value: 'SO', label: 'SO - Somalia' },
  { value: 'SR', label: 'SR - Suriname' },
  { value: 'SS', label: 'SS - South Sudan' },
  { value: 'ST', label: 'ST - Sao Tome and Principe' },
  { value: 'SV', label: 'SV - El Salvador' },
  { value: 'SX', label: 'SX - Sint Maarten' },
  { value: 'SY', label: 'SY - Syria' },
  { value: 'SZ', label: 'SZ - Eswatini' },
  { value: 'TC', label: 'TC - Turks and Caicos Islands' },
  { value: 'TD', label: 'TD - Chad' },
  { value: 'TF', label: 'TF - French Southern Territories' },
  { value: 'TG', label: 'TG - Togo' },
  { value: 'TH', label: 'TH - Thailand' },
  { value: 'TJ', label: 'TJ - Tajikistan' },
  { value: 'TK', label: 'TK - Tokelau' },
  { value: 'TL', label: 'TL - Timor-Leste' },
  { value: 'TM', label: 'TM - Turkmenistan' },
  { value: 'TN', label: 'TN - Tunisia' },
  { value: 'TO', label: 'TO - Tonga' },
  { value: 'TR', label: 'TR - Turkey' },
  { value: 'TT', label: 'TT - Trinidad and Tobago' },
  { value: 'TV', label: 'TV - Tuvalu' },
  { value: 'TW', label: 'TW - Taiwan' },
  { value: 'TZ', label: 'TZ - Tanzania' },
  { value: 'UA', label: 'UA - Ukraine' },
  { value: 'UG', label: 'UG - Uganda' },
  { value: 'US', label: 'US - United States' },
  { value: 'UY', label: 'UY - Uruguay' },
  { value: 'UZ', label: 'UZ - Uzbekistan' },
  { value: 'VA', label: 'VA - Vatican City' },
  { value: 'VC', label: 'VC - Saint Vincent and the Grenadines' },
  { value: 'VE', label: 'VE - Venezuela' },
  { value: 'VG', label: 'VG - British Virgin Islands' },
  { value: 'VI', label: 'VI - U.S. Virgin Islands' },
  { value: 'VN', label: 'VN - Vietnam' },
  { value: 'VU', label: 'VU - Vanuatu' },
  { value: 'WF', label: 'WF - Wallis and Futuna' },
  { value: 'WS', label: 'WS - Samoa' },
  { value: 'YE', label: 'YE - Yemen' },
  { value: 'YT', label: 'YT - Mayotte' },
  { value: 'ZA', label: 'ZA - South Africa' },
  { value: 'ZM', label: 'ZM - Zambia' },
  { value: 'ZW', label: 'ZW - Zimbabwe' },
];

declare global {
  interface Window {
    Square: any;
  }
}

interface UserSubscription {
  id: number;
  created_at: number;
  status: string;
  object_id: string;
  card_id: string;
  location_id: string;
  plan_variation_id: string;
  start_date: number;
  end_date: number;
  cancellation_data: any;
  version: number;
  email: string;
  business_id: string;
  user_id: string;
  customer_id: string;
  cadence: string;
  available_credit: number;
  subscription_amount: number;
}

export default function MembersManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchEmail, setUserSearchEmail] = useState('');
  const [userPageNumber, setUserPageNumber] = useState(0);
  const [userHasMore, setUserHasMore] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'ACTIVE',
    start_date: '',
    available_credit: 0
  });
  const [editFormData, setEditFormData] = useState({
    status: '',
    start_date: '',
    available_credit: 0
  });
  const [cardFormData, setCardFormData] = useState({
    plan_variation_id: '',
    amount: 0,
    card_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    cancellation_data: null
  });
  const [subscriptionVariations, setSubscriptionVariations] = useState<any[]>([]);
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCardMode, setIsCardMode] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    postalCode: '',
    countryCode: '',
    cardHolderName: '',
  });
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redux state
  const { userSubscriptions, loading: subscriptionsLoading, error: adminError } = useAppSelector((state) => state.admin);

  useEffect(() => {
      if (!AdminAuthService.isAuthenticated()) {
        router.push('/login');
        return;
      }

    if (!AdminAuthService.hasAdminRole()) {
          AdminAuthService.removeAuthToken();
          router.push('/login');
          return;
        }

        dispatch(fetchAllUserSubscriptions());
    setLoading(false);
  }, [router, dispatch]);

  // Load Square script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Square) {
      // Remove any existing Square scripts to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="squarecdn.com"]');
      existingScripts.forEach(script => script.remove());
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://web.squarecdn.com/v1/square.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => {
          console.log('Square script loaded');
        };
        document.head.appendChild(script);
      }
    }
  }, []);

  // Initialize Square when payment form is shown
  useEffect(() => {
    if (showPaymentForm && window.Square && !initializedRef.current) {
      initializeSquare();
    }

    return () => {
      // Cleanup function
      if (cardRef.current) {
        try {
          cardRef.current.destroy();
        } catch (error) {
          console.log('Card cleanup error:', error);
        }
      }
      initializedRef.current = false;
    };
  }, [showPaymentForm]);

  // Filter subscriptions based on search
  const filteredSubscriptions = searchEmail 
    ? userSubscriptions.filter(sub => sub.email.toLowerCase().includes(searchEmail.toLowerCase()))
    : userSubscriptions;

  // Show loading state
  if (loading || subscriptionsLoading) {
    return <CardLoader text="Loading members..." />;
  }

  // Show error state
  if (adminError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <ErrorDisplay error={adminError} />
      </div>
    );
  }

  const handleCreateSubscriptionWithCard = async () => {
    setCardFormData({
      plan_variation_id: '',
      amount: 0,
      card_id: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      cancellation_data: null
    });
    setSelectedUser(null);
    setUsers([]);
    setUserSearchEmail('');
    setUserPageNumber(0);
    setUserHasMore(true);
    setPaymentFormData({
      postalCode: '',
      countryCode: '',
      cardHolderName: '',
    });
    await loadUsers(0, '', false);
    await loadSubscriptionVariations();
    setIsCardMode(true);
    setShowCardForm(true);
    setError('');
  };

  const handleCreateSubscriptionWithoutCard = async () => {
    setCardFormData({
      plan_variation_id: '',
      amount: 0,
      card_id: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      cancellation_data: null
    });
    setSelectedUser(null);
    setUsers([]);
    setUserSearchEmail('');
    setUserPageNumber(0);
    setUserHasMore(true);
    await loadUsers(0, '', false);
    await loadSubscriptionVariations();
    setIsCardMode(false);
    setShowCardForm(true);
    setError('');
  };

  const handleSearch = async () => {
    // For now, we'll just filter the existing subscriptions
    // In a real app, you'd want to implement server-side search
    dispatch(fetchAllUserSubscriptions());
  };

  const handleClearSearch = async () => {
    setSearchEmail('');
    dispatch(fetchAllUserSubscriptions());
  };

  const loadUsers = async (page = 0, email = '', append = false) => {
    try {
      if (!append) {
        setIsLoadingUsers(true);
      }
      
      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/users?business_id=${BUSINESS_ID}&page_number=${page}&email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      
      if (append) {
        setUsers(prev => [...prev, ...data]);
        setUserHasMore(data.length === 5); // 5 users per page
      } else {
        setUsers(data);
        setUserHasMore(data.length === 5);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUserSearch = async () => {
    setUserPageNumber(0);
    setUserHasMore(true);
    await loadUsers(0, userSearchEmail, false);
  };

  const handleUserLoadMore = async () => {
    if (!userHasMore || isLoadingUsers || userSearchEmail) return;
    
    const nextPage = userPageNumber + 1;
    setUserPageNumber(nextPage);
    await loadUsers(nextPage, '', true);
  };

  const handleUserClearSearch = async () => {
    setUserSearchEmail('');
    setUserPageNumber(0);
    setUserHasMore(true);
    await loadUsers(0, '', false);
  };

  const initializeSquare = async () => {
    try {
      if (!window.Square || initializedRef.current || !cardContainerRef.current) {
        return;
      }

      paymentsRef.current = window.Square.payments(SQUARE_CONFIG.applicationId, SQUARE_CONFIG.locationId);
      
      cardRef.current = await paymentsRef.current.card();

      if (cardContainerRef.current) {
        await cardRef.current.attach(cardContainerRef.current);
        initializedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to initialize Square:', error);
      setError('Failed to initialize payment system');
    }
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentFormData({
      ...paymentFormData,
      [e.target.name]: e.target.value,
    });
  };

  const loadSubscriptionVariations = async () => {
    try {
      setIsLoadingVariations(true);
      
      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/subscription/subscription-variation?business_id=${BUSINESS_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load subscription variations');
      }

      const data = await response.json();
      setSubscriptionVariations(data);
    } catch (error: any) {
      console.error('Error loading subscription variations:', error);
      setError(error.message || 'Failed to load subscription variations');
    } finally {
      setIsLoadingVariations(false);
    }
  };

  const handleEditSubscription = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setEditFormData({
      status: subscription.status,
      start_date: new Date(subscription.start_date).toISOString().split('T')[0],
      available_credit: subscription.available_credit
    });
    setShowEditForm(true);
    setError('');
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    // Security check: Ensure the subscription belongs to the current business
    if (selectedSubscription.business_id !== BUSINESS_ID) {
      setError('You can only edit subscriptions from your own business.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const updateData = {
        status: editFormData.status,
        object_id: selectedSubscription.object_id,
        start_date: new Date(editFormData.start_date).getTime(),
        end_date: selectedSubscription.end_date,
        cancellation_data: selectedSubscription.cancellation_data,
        email: selectedSubscription.email,
        business_id: BUSINESS_ID,
        available_credit: editFormData.available_credit,
        subscription_amount: selectedSubscription.subscription_amount
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/subscription/update-user-subscription`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subscription');
      }

      // Refresh the subscriptions list
      dispatch(fetchAllUserSubscriptions());
      setShowEditForm(false);
      setSelectedSubscription(null);
    } catch (error: any) {
      setError(error.message || 'Failed to update subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const createData = {
        business_id: BUSINESS_ID,
        status: createFormData.status,
        start_date: new Date(createFormData.start_date).getTime(),
        available_credit: createFormData.available_credit
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/subscription/admin/create-sub-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(createData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      dispatch(fetchAllUserSubscriptions());
      setShowCreateForm(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlanVariationChange = (planVariationId: string) => {
    setCardFormData({
      ...cardFormData,
      plan_variation_id: planVariationId
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentsRef.current) {
      setError('Payment system not initialized');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (!cardRef.current) {
        setError('Payment system not initialized');
        return;
      }
      
      const result = await cardRef.current.tokenize();
      
      if (result.status === 'OK') {
        // First, add the card
        const cardData = {
          sourceId: result.token,
          cardToken: result.token,
          postalCode: paymentFormData.postalCode,
          countryCode: paymentFormData.countryCode,
          cardHolderName: paymentFormData.cardHolderName,
          business_id: BUSINESS_ID,
          user_id: selectedUser.id,
        };

        const cardResponse = await fetch(
          `${AuthService.getApiBaseUrl()}/admin/card/add`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
            },
            body: JSON.stringify(cardData),
          }
        );

        if (!cardResponse.ok) {
          const errorData = await cardResponse.json();
          throw new Error(errorData.message || 'Failed to add card');
        }

        const cardResult = await cardResponse.json();
        const card_id = cardResult.card_id;

        // Get the selected variation to get the amount
        const selectedVariation = subscriptionVariations.find(v => v.object_id === cardFormData.plan_variation_id);
        const amount = selectedVariation && selectedVariation.amount ? selectedVariation.amount : 0;
        
        // Now create the subscription with the card_id
        const subscriptionData = {
          business_id: BUSINESS_ID,
          plan_variation_id: cardFormData.plan_variation_id,
          card_id: card_id,
          user_id: selectedUser.id,
          amount: amount
        };

        const subscriptionResponse = await fetch(
          `${AuthService.getApiBaseUrl()}/admin/subscription/user/create-a-subscription`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
            },
            body: JSON.stringify(subscriptionData),
          }
        );

        if (!subscriptionResponse.ok) {
          const errorData = await subscriptionResponse.json();
          throw new Error(errorData.message || 'Failed to create subscription');
        }

        showToast.success('Subscription created successfully!');
        
        // Reset form
        setCardFormData({
          plan_variation_id: '',
          amount: 0,
          card_id: '',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          cancellation_data: null
        });
        setSelectedUser(null);
        setShowCardForm(false);
        setShowPaymentForm(false);
        
        // Refresh subscriptions list
        dispatch(fetchAllUserSubscriptions());
      } else {
        setError('Card tokenization failed');
      }
    } catch (error: any) {
      setError(error.message || 'Payment failed');
      showToast.error(error.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubscriptionWithoutCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a user first');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // Get the selected variation to get the amount
      const selectedVariation = subscriptionVariations.find(v => v.object_id === cardFormData.plan_variation_id);
      const amount = selectedVariation && selectedVariation.amount ? selectedVariation.amount : 0;
      
      // Create subscription without card
      const subscriptionData = {
        business_id: BUSINESS_ID,
        plan_variation_id: cardFormData.plan_variation_id,
        user_id: selectedUser.id,
        amount: amount
      };

      const subscriptionResponse = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/subscription/user/create-a-subscription/without-card`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      showToast.success('Subscription created successfully!');
      
      // Reset form
      setCardFormData({
        plan_variation_id: '',
        amount: 0,
        card_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        cancellation_data: null
      });
      setSelectedUser(null);
      setShowCardForm(false);
      
      // Refresh subscriptions list
      await loadSubscriptions(0, searchEmail, false);
    } catch (error: any) {
      setError(error.message || 'Failed to create subscription');
      showToast.error(error.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a user first');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // First, get the card_id by calling the card API
      const cardResponse = await fetch(
        `${AuthService.getApiBaseUrl()}/card/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify({
            business_id: BUSINESS_ID,
            user_id: selectedUser.id
          }),
        }
      );

      if (!cardResponse.ok) {
        const errorData = await cardResponse.json();
        throw new Error(errorData.message || 'Failed to get card information');
      }

      const cardData = await cardResponse.json();
      const card_id = cardData.card_id;

      // Get the selected variation to get the amount
      const selectedVariation = subscriptionVariations.find(v => v.object_id === cardFormData.plan_variation_id);
      
      // Now create the subscription with the card_id
      const subscriptionData = {
        business_id: BUSINESS_ID,
        plan_variation_id: cardFormData.plan_variation_id,
        card_id: card_id,
        user_id: selectedUser.id,
        amount: selectedVariation && selectedVariation.amount ? selectedVariation.amount : 0
      };

      const subscriptionResponse = await fetch(
        `${AuthService.getApiBaseUrl()}/admin/subscription/user/create-a-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      showToast.success('Subscription created successfully!');
      
      // Reset form
      setCardFormData({
        plan_variation_id: '',
        amount: 0,
        card_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        cancellation_data: null
      });
      setSelectedUser(null);
      setShowCardForm(false);
      
      // Refresh subscriptions list
      await loadSubscriptions(0, searchEmail, false);
    } catch (error: any) {
      setError(error.message || 'Failed to create subscription');
      showToast.error(error.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUserAndSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // First, create the user using signup API
      const signupData = {
        business_id: BUSINESS_ID,
        name: createFormData.name,
        email: createFormData.email,
        password: createFormData.password
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'ERROR_CODE_ACCESS_DENIED') {
          throw new Error('This email is already registered. Please use a different email address.');
        }
        throw new Error(errorData.message || 'Failed to create user');
      }

      const userData = await response.json();
      console.log(userData);
      
      // Now create subscription using the user's authToken
      const subscriptionData = {
        business_id: BUSINESS_ID,
        email: createFormData.email,
        status: createFormData.status,
        start_date: new Date(createFormData.start_date).getTime(),
        available_credit: createFormData.available_credit
      };

      const subscriptionResponse = await fetch(
        `${AuthService.getApiBaseUrl()}/subscription/admin/create-sub-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.authToken}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json();
        if (errorData.code === 'ERROR_CODE_ACCESS_DENIED') {
          throw new Error('Failed to create subscription. Please try again.');
        }
        throw new Error(errorData.message || 'Failed to create subscription for user');
      }

      await loadSubscriptions(0, searchEmail, false);
      setShowCreateForm(false);
      alert('User and subscription created successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to create user and subscription');
      alert(error.message || 'Failed to create user and subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const updateData = {
        business_id: BUSINESS_ID,
        user_id: selectedSubscription!.user_id,
        object_id: selectedSubscription!.object_id,
        status: editFormData.status,
        start_date: new Date(editFormData.start_date).getTime(),
        available_credit: editFormData.available_credit
      };

      const response = await fetch(
        `${AuthService.getApiBaseUrl()}/subscription/admin/user-subscription`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AdminAuthService.getAuthToken()}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subscription');
      }

      await loadSubscriptions(0, searchEmail, false);
      setShowEditForm(false);
      setSelectedSubscription(null);
      alert('Subscription updated successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to update subscription');
      alert(error.message || 'Failed to update subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100' : 'bg-gray-100';
  };

      if (loading || subscriptionsLoading) {
      return <CardLoader text="Loading members..." />;
    }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background.secondary }}>
        <ErrorDisplay error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background.secondary }}>
      {/* Admin Header */}
      <AdminHeader 
        title="Members" 
        subtitle="Manage user subscriptions"
      />

      {/* Main Content */}
      <main className="p-4 pb-24">
        {/* Action Buttons */}
        <div className="mb-6 space-y-3">
          <button
            onClick={() => handleCreateSubscriptionWithCard()}
            className="w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Create Subscription with Card
          </button>
          
          <button
            onClick={() => handleCreateSubscriptionWithoutCard()}
            className="w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
            style={{ backgroundColor: COLORS.success.main, color: COLORS.success.text }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.success.dark}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.success.main}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Subscription without Card
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by email..."
                                      className="w-full px-4 py-3 pl-10 border rounded-xl focus:ring-2 focus:border-transparent"
                                      style={{ borderColor: COLORS.border.secondary }}
                                      onFocus={(e) => {
                                        e.target.style.borderColor = COLORS.primary.main;
                                        e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                                      }}
                                      onBlur={(e) => {
                                        e.target.style.borderColor = COLORS.border.secondary;
                                        e.target.style.boxShadow = 'none';
                                      }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 [style-color-gray-400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-3 rounded-xl font-medium transition-colors"
              style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
            >
              Search
            </button>
            {searchEmail && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 rounded-xl font-medium transition-colors"
                style={{ backgroundColor: COLORS.secondary.main, color: COLORS.success.text }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.secondary.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.secondary.main}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.error.main, border: '1px solid' }}>
            <p className="text-sm" style={{ color: COLORS.error.main }}>{error}</p>
          </div>
        )}

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions.map((subscription) => (
            <div key={subscription.id} className="rounded-xl shadow-sm p-4 border" style={{ backgroundColor: COLORS.background.primary, borderColor: COLORS.border.primary }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5" style={{ color: COLORS.text.secondary }} />
                    <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>{subscription.email}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                    User ID: {subscription.user_id}
                  </p>
                  <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>
                    Subscription ID: {subscription.object_id}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    Created: {formatDate(subscription.created_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {subscription.business_id !== BUSINESS_ID && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: COLORS.border.light, color: COLORS.text.secondary }}>
                      Other Business
                    </span>
                  )}
                  <button
                    onClick={() => handleEditSubscription(subscription)}
                    disabled={subscription.business_id !== BUSINESS_ID}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      cursor: subscription.business_id === BUSINESS_ID ? 'pointer' : 'not-allowed',
                      opacity: subscription.business_id === BUSINESS_ID ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (subscription.business_id === BUSINESS_ID) {
                        e.currentTarget.style.backgroundColor = COLORS.border.light;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (subscription.business_id === BUSINESS_ID) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    title={subscription.business_id !== BUSINESS_ID ? 'You can only edit subscriptions from your own business' : 'Edit subscription'}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Credits Section */}
              <div className="mb-4">
                <div className="rounded-xl p-4 border" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.light }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard className="h-4 w-4" style={{ color: COLORS.text.primary }} />
                        <span className="text-sm font-medium" style={{ color: COLORS.text.primary }}>Available Credits</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>{subscription.available_credit}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
                        Credits remaining for redemption
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs mb-1" style={{ color: COLORS.text.secondary }}>Subscription</div>
                      <div className="text-sm font-semibold" style={{ color: COLORS.text.primary }}>
                        ${(subscription.subscription_amount / 100).toFixed(2)}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                        per {subscription.cadence.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="mb-4">
                <div className="rounded-lg p-3 border" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.secondary }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>Subscription Dates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span style={{ color: COLORS.text.secondary }}>Start Date:</span>
                      <span className="ml-2 font-medium" style={{ color: COLORS.text.primary }}>
                        {subscription.start_date ? formatDate(subscription.start_date) : 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: COLORS.text.secondary }}>End Date:</span>
                      <span className="ml-2 font-medium" style={{ color: COLORS.text.primary }}>
                        {subscription.end_date ? formatDate(subscription.end_date) : 'Not set'}
                      </span>
                    </div>
                  </div>
                  {subscription.cancellation_data && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${COLORS.border.secondary}` }}>
                      <span style={{ color: COLORS.text.secondary }}>Cancellation Data:</span>
                      <div className="mt-1 p-2 rounded text-xs" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.error.main, border: '1px solid' }}>
                        <pre className="whitespace-pre-wrap break-words" style={{ color: COLORS.error.main }}>
                          {JSON.stringify(subscription.cancellation_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs space-y-1" style={{ color: COLORS.text.secondary }}>
                <p>Location ID: {subscription.location_id}</p>
                <p>Plan Variation ID: {subscription.plan_variation_id}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredSubscriptions.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.text.secondary }} />
            <p style={{ color: COLORS.text.secondary }}>
              {searchEmail ? `No subscriptions found for email "${searchEmail}".` : 'No subscriptions found. Create your first subscription to get started.'}
            </p>
          </div>
        )}
      </main>

      {/* Create User & Subscription Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Create New User & Subscription</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateUserAndSubscriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.success.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.success.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.success.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.success.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.success.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.success.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter password"
                  />
                </div>

                <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.light, border: '1px solid' }}>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    <strong>Note:</strong> This will create a new user account and automatically create a subscription.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Status *
                  </label>
                  <select
                    value={createFormData.status}
                    onChange={(e) => setCreateFormData({...createFormData, status: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={createFormData.start_date}
                    onChange={(e) => setCreateFormData({...createFormData, start_date: e.target.value})}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Reduce Subscriber Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.available_credit}
                    onChange={(e) => setCreateFormData({...createFormData, available_credit: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="0"
                  />
                  <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>Enter amount to reduce from current credits</p>
                </div>



                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create User & Subscription
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscription Form Modal */}
      {showEditForm && selectedSubscription && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Edit Subscription</h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="p-2 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubscription} className="space-y-4">
                {/* User Information */}
                <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: COLORS.background.secondary }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: COLORS.text.primary }}>User Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={selectedSubscription.email}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        style={{ borderColor: COLORS.border.secondary, backgroundColor: COLORS.background.primary, color: COLORS.text.secondary }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        User ID
                      </label>
                      <input
                        type="text"
                        value={selectedSubscription.user_id}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                        style={{ borderColor: COLORS.border.secondary, backgroundColor: COLORS.background.primary, color: COLORS.text.secondary }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: COLORS.text.secondary }}>
                        Subscription ID
                      </label>
                      <input
                        type="text"
                        value={selectedSubscription.object_id}
                        disabled
                        className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                        style={{ borderColor: COLORS.border.secondary, backgroundColor: COLORS.background.primary, color: COLORS.text.secondary }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Subscription Status *
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ borderColor: COLORS.border.secondary }}
                      onFocus={(e) => {
                        e.target.style.borderColor = COLORS.primary.main;
                        e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = COLORS.border.secondary;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={editFormData.start_date}
                      onChange={(e) => setEditFormData({...editFormData, start_date: e.target.value})}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ borderColor: COLORS.border.secondary }}
                      onFocus={(e) => {
                        e.target.style.borderColor = COLORS.primary.main;
                        e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = COLORS.border.secondary;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Available Credits
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.available_credit}
                      onChange={(e) => setEditFormData({...editFormData, available_credit: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                    style={{ borderColor: COLORS.border.secondary }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary.main;
                      e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = COLORS.border.secondary;
                      e.target.style.boxShadow = 'none';
                    }}
                      placeholder="0"
                    />
                    <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>Set the available credits for this user</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                      Subscription Amount (cents)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedSubscription.subscription_amount}
                      disabled
                      className="w-full px-4 py-3 border rounded-xl"
                      style={{ borderColor: COLORS.border.secondary, backgroundColor: COLORS.background.secondary, color: COLORS.text.secondary }}
                      placeholder="0"
                    />
                    <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>Monthly subscription amount in cents (read-only)</p>
                  </div>
                </div>



                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Update Subscription
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Card Subscription Modal */}
      {showCardForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                  {isCardMode ? 'Create Subscription with Card' : 'Create Subscription without Card'}
                </h2>
                <button
                  onClick={() => setShowCardForm(false)}
                  className="p-2 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCardSubscriptionSubmit} className="space-y-4">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Choose User for Subscription *
                  </label>
                  <div className="space-y-2">
                    {/* User Search */}
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          value={userSearchEmail}
                          onChange={(e) => setUserSearchEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                          placeholder="Search by email..."
                          className="w-full px-3 py-2 pl-8 border rounded-lg focus:ring-2 focus:border-transparent text-sm"
                          style={{ borderColor: COLORS.border.secondary }}
                          onFocus={(e) => {
                            e.target.style.borderColor = COLORS.primary.main;
                            e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = COLORS.border.secondary;
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 [style-color-gray-400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleUserSearch}
                        className="px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                        style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                      >
                        Search
                      </button>
                    </div>

                    {/* Users List */}
                    <div className="max-h-40 overflow-y-auto border rounded-lg" style={{ borderColor: COLORS.border.secondary }}>
                      {isLoadingUsers ? (
                        <div className="p-4 text-center">
                          <InlineLoader size="sm" />
                          <p className="text-sm mt-2" style={{ color: COLORS.text.secondary }}>Loading users...</p>
                        </div>
                      ) : users.length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-sm" style={{ color: COLORS.text.secondary }}>No users found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {users.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => setSelectedUser(user)}
                              className="w-full text-left p-3 transition-colors"
                              style={{ 
                                backgroundColor: selectedUser?.id === user.id ? COLORS.background.secondary : 'transparent',
                                borderLeft: selectedUser?.id === user.id ? `4px solid ${COLORS.primary.main}` : 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (selectedUser?.id !== user.id) {
                                  e.currentTarget.style.backgroundColor = COLORS.border.light;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedUser?.id !== user.id) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm" style={{ color: COLORS.text.primary }}>{user.name}</p>
                                  <p className="text-xs" style={{ color: COLORS.text.secondary }}>{user.email}</p>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full" style={{ 
                                  backgroundColor: user.role === 'admin' ? COLORS.border.light : COLORS.border.light,
                                  color: user.role === 'admin' ? COLORS.primary.main : COLORS.text.secondary
                                }}>
                                  {user.role}
                                </span>
                              </div>
                            </button>
                          ))}
                          
                          {/* Load More Button */}
                          {userHasMore && !userSearchEmail && (
                            <button
                              type="button"
                              onClick={handleUserLoadMore}
                              disabled={isLoadingUsers}
                              className="w-full p-2 text-center text-sm disabled:opacity-50 transition-colors"
                              style={{ color: COLORS.primary.main }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {isLoadingUsers ? 'Loading...' : 'Load More Users'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected User Display */}
                    {selectedUser && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Selected User:</p>
                        <p className="text-sm text-green-700">{selectedUser.name} ({selectedUser.email})</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Variation Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Choose Subscription Plan *
                  </label>
                  {isLoadingVariations ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">
                      <InlineLoader size="sm" />
                      <span className="ml-2 text-sm text-gray-500">Loading variations...</span>
                    </div>
                  ) : (
                    <select
                      value={cardFormData.plan_variation_id}
                      onChange={(e) => handlePlanVariationChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ borderColor: COLORS.border.secondary }}
                      onFocus={(e) => {
                        e.target.style.borderColor = COLORS.primary.main;
                        e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary.main}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = COLORS.border.secondary;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Choose a subscription plan...</option>
                      {subscriptionVariations.map((variation, index) => (
                        <option key={`${variation.id}-${variation.object_id}-${index}`} value={variation.object_id}>
                          {variation.name} - {variation.cadence} - ${variation.amount ? (variation.amount / 100).toFixed(2) : 'N/A'}
                        </option>
                      ))}
                    </select>
                  )}
                  {cardFormData.plan_variation_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {subscriptionVariations.find(v => v.object_id === cardFormData.plan_variation_id)?.name}
                    </p>
                  )}
                </div>



                <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.background.secondary, borderColor: COLORS.border.light, border: '1px solid' }}>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                    <strong>Note:</strong> This will create a subscription with card payment for the selected user.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCardForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submitting || !selectedUser || !cardFormData.plan_variation_id}
                    onClick={isCardMode ? () => setShowPaymentForm(true) : handleSubscriptionWithoutCard}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {isCardMode ? (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create Subscription
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Square Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: COLORS.background.primary }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: COLORS.text.primary }}>Payment Information</h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="p-2 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.border.light}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Selected User and Plan Info */}
              {selectedUser && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Selected User:</p>
                  <p className="text-sm" style={{ color: COLORS.text.secondary }}>{selectedUser.name} ({selectedUser.email})</p>
                  {cardFormData.plan_variation_id && (
                    <>
                      <p className="text-sm font-medium text-blue-800 mt-2">Selected Plan:</p>
                      <p className="text-sm" style={{ color: COLORS.text.secondary }}>
                        {subscriptionVariations.find(v => v.object_id === cardFormData.plan_variation_id)?.name}
                      </p>
                    </>
                  )}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Square Card Container */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text.primary }}>
                    Card Information
                  </label>
                  <div 
                    key="square-card-container"
                    ref={cardContainerRef}
                    className="w-full h-32 mb-4 min-h-[128px] border border-gray-300 rounded-xl"
                    style={{ minHeight: '128px' }}
                  />
                </div>

                {/* Card Holder Name */}
                <div>
                  <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    id="cardHolderName"
                    name="cardHolderName"
                    value={paymentFormData.cardHolderName}
                    onChange={handlePaymentInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
                    placeholder="Enter card holder name"
                    required
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={paymentFormData.postalCode}
                    onChange={handlePaymentInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
                    placeholder="Enter postal code"
                    required
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={paymentFormData.countryCode}
                    onChange={handlePaymentInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8c52ff] focus:border-transparent"
                    required
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 border py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ borderColor: COLORS.border.secondary, color: COLORS.text.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary.main, color: COLORS.success.text }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary.main}
                  >
                    {submitting ? (
                      <>
                        <ButtonLoader size="sm" />
                        Processing...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );

  // Helper function to load subscriptions (replaced with Redux)
  const loadSubscriptions = async (page: number, search: string, reset: boolean) => {
    dispatch(fetchAllUserSubscriptions());
  };


}
