export const locale = {
  lang: 'en',
  data: {
    /**
     * GENERAL TRANSLATION (Γενικές Μεταφράσεις)
     */
    TRANSLATOR: {
      SELECT: 'Select your language',
    },
    HEADER: {
      MESSAGE: 'Welcome'
    },
    GENERAL: {
      FROM: 'from',
      TO: 'until'
    },


    /**
     * MENU TRANSLATION (Μετάφραση Περιεχομένου)
     */
    MENU: {
      /* USER MENU (Μενού Χρήστη)*/
      SETTINGS: 'Account',
      HISTORY: 'History',

      /* MEMBER MENU (Μενού Μέλους)*/
      WALLET: 'Wallet',
      DISCOVER: 'Discover',
      SUPPORT: 'Suppport',
      OFFERS: 'Offers',

      /* PARTNER MENU (Μενού Συνεργάτη)*/
      NEW: 'new',
      ACTIONS: 'Actions',
      PAGES: 'Pages',
      FEATURES: 'Features',
      APPS: 'Apps',
      DASHBOARD: 'Dashboard',
      HOME: 'Home',
      CAMPAIGNS: 'Campaigns',
      EVENTS: 'Events',
      POSTS: 'Posts',
      // OFFERS: 'Offers',

      /* ADMIN MENU (Μενού Διαχειριστή)*/
      PARTNERS: 'Partners',
      MEMBERS: 'Members',
      CONTENT: 'Content',
    },


    /**
     * AUTH TRANSLATION (Μετάφραση Auth)
     */
    AUTH: {
      MESSAGES: {
        WELCOME_TITLE: 'Welcome to Synergy!',
        WELCOME_SUBTITLE: 'A Financial Toolkit for Cooperatives',
        HAVE_ACCOUNT: 'Don\'t have an account yet?',
        ALREADY_VALIDATED: 'Do you have already validated your email address?',
        ALREADY_RESTORATION: 'Do you have already restore your password?',
        ALREADY_UPDATED: 'Do you have already updated your password?',
        PARTNER_ACCOUNT: 'Do you want to register as a partner?'
      },
      GENERAL: {
        OR: 'Or',
        SUBMIT_BUTTON: 'Submit',
        FORGOT_BUTTON: 'Forgot Password',
        BACK_BUTTON: 'Back',
        PRIVACY: 'Privacy',
        LEGAL: 'Legal',
        CONTACT: 'Contact',
        AS_PARTNER: 'as Partner'
      },
      LOGIN: {
        TITLE: 'Sign In',
        BUTTON: 'Sign In',
        EMAIL_NEEDS_VERIFICATION: 'You have to verify your email address',
        PASSWORD_NEEDS_UPDATE: 'You have to update your password',
        ACCOUNT_NEEDS_ACTIVATION: 'You have to reactivate your account'
      },
      LOGOUT: {
        BUTTON: 'Sign out'
      },
      REGISTER: {
        TITLE: 'Sign Up',
        BUTTON: 'Sign Up',
        DESC: 'Enter your details to create your account',
        SUCCESS: 'Your account has been successfuly registered. We have send an email in your address. Please follow the link to verify your account',
      },
      TERMS: {
        A: 'I agree with the',
        B: 'Terms & Conditions'
      },
      VERIFY_EMAIL: {
        TITLE: 'Email Verification',
        TITLE_ASK: 'Non Validated Email Address?',
        SUCCESS_CHECK: 'Your email address has been validated!',
        SUCCESS_SEND: 'You will receive an email! Follow the link to validate your address!',
      },
      VERIFY_PASSWORD: {
        TITLE: 'Update Password',
        SUCCESS: 'Your password has been successfully updated!',
      },
      FORGOT_PASSWORD: {
        TITLE_ASK: 'Forgotten Password?',
        DESC: 'Enter your email to reset your password',
        SUCCESS_SEND: 'You will receive an email! Follow the link to reset your password!',
        SUCCESS_CHECK: 'Your can procceed to reseting password!',
        SUCCESS_UPDATE: 'Your password has been successfully reset!',
      },
    },


    /**
     * FORMS & FIELDS TRANSLATION (Μετάφραση Φορμών & Πεδίων)
     */
    FIELDS: {
      PROFILE: {
        EMAIL: {
          TITLE: 'Email Address',
          PLACEHOLDER: 'Email',
          DESC: ''
        },
        PASSWORD: {
          TITLE: 'Password',
          PLACEHOLDER: 'Password',
          DESC: ''
        },
        CURRENT_PASSWORD: {
          TITLE: 'Current Password',
          PLACEHOLDER: 'Password',
          DESC: 'Please insert current password'
        },
        NEW_PASSWORD: {
          TITLE: 'New Password',
          PLACEHOLDER: 'Password',
          DESC: 'Please insert a new password'
        },
        CONFIRM_PASSWORD: {
          TITLE: 'Confirm Password',
          PLACEHOLDER: 'Password',
          DESC: 'Please confirm your password'
        },
        MEMBER_NAME: {
          TITLE: 'Name',
          PLACEHOLDER: 'Name',
          DESC: 'Please, enter your name'
        },
        MEMBER_IMAGE: {
          TITLE: 'Avatar',
          ACTION: 'Choose File'
        },
        PARTNER_NAME: {
          TITLE: 'Company Name',
          PLACEHOLDER: 'Name',
          DESC: 'Please, enter your company\'s name'
        },
        PARTNER_IMAGE: {
          TITLE: 'Logo or Image',
          ACTION: 'Choose File'
        },
        SUBTITLE: {
          TITLE: 'Abstract',
          PLACEHOLDER: 'Abstract',
          DESC: 'Please, enter your company\'s abstract'
        },
        DESCRIPTION: {
          TITLE: 'Description',
          PLACEHOLDER: 'Description',
          DESC: 'Please choose your company\'s description'
        },
        SECTOR: {
          TITLE: 'Sector',
          PLACEHOLDER: '',
          DESC: 'Please choose your company\'s sector'
        },
        TIMETABLE: {
          TITLE: 'Timetable',
          PLACEHOLDER: 'Timetable',
          DESC: 'Please enter your company\'s timetable'
        },
        PHONE: {
          TITLE: 'Phone',
          PLACEHOLDER: 'Phone',
          DESC: 'Please enter your company\'s phone'
        },
        WEBSITE: {
          TITLE: 'Website',
          PLACEHOLDER: 'Website',
          DESC: 'Please enter your company\'s website'
        },
        ADDRESS: {
          TITLE: 'Address',
          PLACEHOLDER: 'Address',
          DESC: 'Please enter your company\'s address'
        },
        POSTCODE: {
          TITLE: 'Postcode',
          PLACEHOLDER: 'Postcode',
          DESC: 'Please enter your company\'s postcode'
        },
        CITY: {
          TITLE: 'City',
          PLACEHOLDER: 'City',
          DESC: 'Please enter your company\'s city'
        },
        LAT: {
          TITLE: 'Coordinates (Latitude)',
          PLACEHOLDER: 'Latitude',
          DESC: 'Please enter your company\'s coordinates (Latitude)'
        },
        LONG: {
          TITLE: 'Coordinates (Longitude)',
          PLACEHOLDER: 'Longitude',
          DESC: 'Please enter your company\'s coordinates (Longitude)'
        },
        PAYMENT: {
          DESC: 'IBAN/Link or other info about bank account'
        },
        DEACTIVATION_REASON: {
          TITLE: '',
          PLACEHOLDER: 'Please, feel free to tell us the reason that you want to deactivate your account (optional)',
          DESC: ''
        },
        SUBSECTIONS: {
          BASIC: 'Basic Info',
          ADDRESS: 'Address',
          CONTACT: 'Contact Info',
          PAYMENTS: 'Payments'
        },
        SECTOR_CHOICES: {
          _: 'Other',
          A: 'Β2Β Services',
          B: 'Durables',
          C: 'Durables (Technology)',
          D: 'Education',
          E: 'Food',
          F: 'Hotels, Cafés and Restaurants',
          G: 'Recreation and Culture',
        },
        PAYMENT_CHOICES: {
          A: 'National Bank of Greece',
          B: 'Pireaus Bank',
          C: 'EFG Eurobank Ergasias',
          D: 'Alpha Bank A.E.',
          E: 'PayPal.Me',
          _F: 'Pay at the Store',
          _G: 'All Payment Methods'
        },
      },
      OFFER: {
        TITLE: {
          TITLE: 'Offer Title',
          PLACEHOLDER: 'Title',
          DESC: 'Please, enter Offer Title.'
        },
        IMAGE: {
          TITLE: 'Offer\'s Image',
          ACTION: 'Choose File'
        },
        SUBTITLE: {
          TITLE: 'Abstract',
          PLACEHOLDER: 'Abstract',
          DESC: 'Please, enter Offer\'s Abstract.'
        },
        DESCRIPTION: {
          TITLE: 'Offer Description',
          PLACEHOLDER: 'Description',
          DESC: 'Please, enter Offer Description.'
        },
        COST: {
          TITLE: 'Cost in points',
          PLACEHOLDER: 'Points',
          DESC: 'Please enter offer required points.'
        },
        EXPIRATION: {
          TITLE: 'Expiration Date',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when your Offer will be expired.'
        }
      },
      POST: {
        TITLE: {
          TITLE: 'Post Title',
          PLACEHOLDER: 'Title',
          DESC: 'Please, enter Post Title.'
        },
        IMAGE: {
          TITLE: 'Post\'s Image',
          ACTION: 'Choose File'
        },
        SUBTITLE: {
          TITLE: 'Abstract',
          PLACEHOLDER: 'Abstract',
          DESC: 'Please, enter Post\'s abstract.'
        },
        CONTENT: {
          TITLE: 'Post Content',
          PLACEHOLDER: 'Content',
          DESC: 'Please, enter Post Content.'
        },
        ACCESS: {
          TITLE: 'Access',
          PLACEHOLDER: 'Access',
          DESC: 'Please, enter when your Access.'
        },
        ACCESS_CHOICES: {
          A: 'Public',
          B: 'Private',
          C: 'Partners'
        },
      },
      EVENT: {
        TITLE: {
          TITLE: 'Event Title',
          PLACEHOLDER: 'Event',
          DESC: 'Please, enter Event Title.'
        },
        IMAGE: {
          TITLE: 'Event\'s Image',
          ACTION: 'Choose File'
        },
        SUBTITLE: {
          TITLE: 'Abstract',
          PLACEHOLDER: 'Abstract',
          DESC: 'Please, enter Event\'s abstract.'
        },
        DESCRIPTION: {
          TITLE: 'Event Description',
          PLACEHOLDER: 'Description',
          DESC: 'Please, enter Event Description.'
        },
        DATE: {
          TITLE: 'Date',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when your Event will take place'
        },
        TIME: {
          TITLE: 'Time',
          PLACEHOLDER: 'Time',
          DESC: 'Please, enter when your Event will take place'
        },
        LOCATION: {
          TITLE: 'Event\'s Location',
          PLACEHOLDER: 'Location',
          DESC: 'Please, enter where your Event will take place'
        },
        ACCESS: {
          TITLE: 'Access',
          PLACEHOLDER: 'Access',
          DESC: 'Please, enter when your Access.'
        },
        ACCESS_CHOICES: {
          A: 'Public',
          B: 'Private',
          C: 'Partners'
        },
      },
      MICROCREDIT_CAMPAIGN: {
        TITLE: {
          TITLE: 'Campaign Title',
          PLACEHOLDER: 'Title',
          DESC: 'Please, enter Campaign Title.'
        },
        IMAGE: {
          TITLE: 'Campaign\'s Image',
          ACTION: 'Choose File'
        },
        SUBTITLE: {
          TITLE: 'Abstract',
          PLACEHOLDER: 'Abstract',
          DESC: 'Please, enter Campaign\'s abstract.'
        },
        TERMS: {
          TITLE: 'Terms Description',
          PLACEHOLDER: 'Description',
          DESC: 'Please, enter Terms Description.'
        },
        DESCRIPTION: {
          TITLE: 'Campaign Description',
          PLACEHOLDER: 'Description',
          DESC: 'Please, enter a Campaign Description.'
        },
        CATEGORY: {
          TITLE: 'Category',
          PLACEHOLDER: 'Category',
          DESC: 'Please, enter the Campaign Category.'
        },
        MIN_ALLOWED_PRICE: {
          TITLE: 'Price',
          PLACEHOLDER: '1000',
          DESC: 'Please, enter the price.'
        },
        MIN_ALLOWED: {
          TITLE: 'Min Allowed',
          PLACEHOLDER: '1000',
          DESC: 'Please, enter your Min Allowed.'
        },
        MAX_ALLOWED: {
          TITLE: 'Max Allowed',
          PLACEHOLDER: '1000',
          DESC: 'Please, enter your Max Allowed.'
        },
        STEP: {
          TITLE: 'Step',
          PLACEHOLDER: '20',
          DESC: 'Please, enter payment step (Optional).'
        },
        MAX_AMOUNT: {
          TITLE: 'Max Amount',
          PLACEHOLDER: '1000',
          DESC: 'Please, enter when your Max Amount.'
        },
        ACCESS: {
          TITLE: 'Access',
          PLACEHOLDER: 'Access',
          DESC: 'Please, enter who has Access.'
        },
        ACCESS_CHOICES: {
          A: 'Public',
          B: 'Private',
          C: 'Partners'
        },
        SUPPORT_STARTS: {
          TITLE: 'Initiation Date',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when your Campaign will begin.'
        },
        SUPPORT_ENDS: {
          TITLE: 'Expiration Date',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when your Campaign will expire.'
        },
        REDEEM_STARTS: {
          TITLE: 'Date redeem starts',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when redeem can begin.'
        },
        REDEEM_ENDS: {
          TITLE: 'Date redeem ends',
          PLACEHOLDER: 'Date',
          DESC: 'Please, enter when redeem can end.'
        },
        QUANTITATIVE: 'Is it Quantitative?',
        SUBMIT_DRAFT: 'Save as Draft',
        SUBMIT_CAMPAIGN: 'Publish Campaign',
        SUBSECTIONS: {
          BASIC: 'Basic Info',
          TERMS: 'Terms and Access',
          FINANCIAL: 'Financial',
          DATES: 'Dates'
        }
      },
      CONTENT: {
        NAME: {
          TITLE: 'Content Name',
          PLACEHOLDER: 'Name',
          DESC: 'Please, enter Content\'s Name'
        },
        EL_TITLE: {
          TITLE: 'Title in greek',
          PLACEHOLDER: 'Greek',
          DESC: 'Please, enter greek Title'
        },
        EN_TITLE: {
          TITLE: 'Title in english',
          PLACEHOLDER: 'English',
          DESC: 'Please, enter english Tiitle'
        },
        EL_CONTENT: {
          TITLE: 'Content in greek',
          PLACEHOLDER: 'Greek',
          DESC: 'Please, enter greek Content'
        },
        EN_CONTENT: {
          TITLE: 'Content in english',
          PLACEHOLDER: 'English',
          DESC: 'Please, enter english Content'
        },
      },
    },

    FORM: {
      BUTTONS: {
        SUBMIT: 'Submit',
        PREVIOUS: 'Previous',
        NEXT_STEP: 'Next Step',
        SAVE: 'Save',
      },
      VALIDATION: {
        REQUIRED_FIELD: 'Required field.',
        MIN_LENGTH_FIELD: 'Minimum field length:',
        MAX_LENGTH_FIELD: 'Maximum field length:',
        INVALID_FIELD: 'Field is not valid.',
        MIN_VALUE_FIELD: 'Minimum field value:',
        MAX_VALUE_FIELD: 'Maximum field value:',
        REQUIRED_ONE: 'At least one field requiered',
        PASSWORD_CONFIRMATION: 'Passsword and ConfirmPassword didn\'t match.',
        AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
        CAMPAIGN_DATES: {
          SUPPORTSTARTSTOSUPPORTENDS: 'Support Starting Date cannot be greater than Support Ending Date',
          SUPPORTSTARTSTOREDEEMSTARTS: 'Support Starting Date cannot be greater than Redeem Starting Date',
          REDEEMSTARTSTOREDEEMENDS: 'Redeem Starting Date cannot be greater than Redeem Ending Date',
          SUPPORTENDSTOREDEEMENDS: 'Support Ending Date cannot be greater than Redeem Ending Date',
        },
      },
    },


    /**
     * MESSAGES TRANSLATION (Μετάφραση Μηνυμάτων)
     */
    MESSAGE: {
      SUCCESS: {
        /* Common Messages (Κοινά Μηνύματα) */
        TITLE: 'All good!',
        PASSWORD_UPDATED: 'Your password has been successfully updated!',
        PROFILE_UPDATED: 'Your Personal Information has been successfully updated!',
        ACCOUNT_DEACTIVATED: 'Your account has been succesfully deactivated!',
        INVITATION_SEND: 'Invtation has been successfully sent!',

        /* Partner Messages (Μηνύματα Συνεργάτη) */
        OFFER_CREATED: 'A new Offer has been successfully created!',
        OFFER_UPDATED: 'The Offer has been successfully updated!',
        OFFER_DELETED: 'The Offer has been successfully deleted!',
        POST_CREATED: 'A new Post has been successfully created!',
        POST_UPDATED: 'The Post has been successfully updated!',
        POST_DELETED: 'The Post has been successfully deleted!',
        EVENT_CREATED: 'A new Event has been successfully created!',
        EVENT_UPDATED: 'The Event has been successfully updated!',
        EVENT_DELETED: 'The Event has been successfully deleted!',
        CAMPAIGN_CREATED: 'A new Campaign has been successfully created!',
        CAMPAIGN_PUBLISHED: 'The Campaign has been successfully published!',
        CAMPAIGN_UPDATED: 'The Campaign has been successfully updated!',
        CAMPAIGN_DELETED: 'The Campaign has been successfully deleted!',

        /* Admin Messages (Μηνύματα Διαχειριστή) */
        MEMBER_CREATED: 'A new Member has been successfully created!',
        PARTNER_CREATED: 'A new Partner has been successfully created!',
        USER_REACTIVATED: 'User is now \'Active\'',
        CONTENT_CREATED: 'Content has been successfully created!',
        CONTENT_UPDATED: 'Content has been successfully updated!',
      },
      ERROR: {
        TITLE: 'Something went wrong!',
      },
      CANCEL: {
        TITLE: 'Action Cancelled!',
      }
    },

    /* Typical HTTP Errors (Τυπικά Μηνύματα Λάθους HTTP) */
    HTTP_ERRORS: {
      UNAUTHORIZED: 'You have not the authority to proceed',
      BAD_REQUEST: 'Some of the parameters are missing',
      FORBIDDEN: 'For some reason you cannot have access in this action',
      NOT_FOUND: 'Service can not procced with your request',
      UNPROCESSABLE_ENTITY: 'Some of the server services encountered a problem',
      SERVER: 'Server is inaccessible'
    },

    /* HTTP 404 Errors (Μηνύματα Λάθους HTTP 404) */
    NOT_FOUND_ERRORS: {
      NOT_ENOUGH_POINTS: 'Not enough points to proccedd',
      OFFER_EXPIRED: 'Offer has been expired',

      CAMPAIGN_PUBLISHED: 'Camapign has already published',
      CAMPAIGN_NOT_PUBLISHED: 'Campaign\'s has not been published yet',
      CAMPAIGN_NOT_STARTED: 'Campaign\'s supporting period has not yet started',
      CAMPAIGN_EXPIRED: 'Campaign\'s supporting period has expired',
      PAYMENT_METHODS_REQUIRED: 'Payment Methods Required! Declare them in your Profile',

      OVER_TOTAL_MAX: 'Support Fund cannot be more than Campaign\'s max amount',
      OVER_MAX_AMOUNT: 'Support Fund cannot be more than max allowed amount',
      UNDER_MIN_AMOUNT: 'Support Fund cannot be less than min allowed amount',
      ZERO_AMOUNT: 'Amount cannot be equal or less than zero',
      METHOD_INAVAILABLE: 'Method you choose in inavailable',

      SUPPORT_NOT_PAID: 'Support is unpaid',
      NOT_ENOUGH_TOKENS: 'Not Enough token to proccedd',

      TOKENS_REDEEMED: 'You can not complete this action as tokens has redeemed from this support',
      CAMPAIGN_REDEEM_STARTED: 'You can not complete this action as campaign\'s redeeming period is running',
      CAMPAIGN_REDEEM_NOT_STARTED: 'Campaign\'s redeeming period has not started yet',
      CAMPAIGN_REDEEM_ENDED: 'Campaign\'s redeeming period has expired',

      /**
       * AUTHENTICATION - Not Found (404)
       */
      MEMBER_NOT_EXISTS: 'No user found with this identifier',
      USER_EXISTS: 'A user with there credentials already exists',
      USER_HAS_CARD: 'A card is already linked to this account',
      USER_HAS_EMAIL: 'An email is already linked to this account',
      WRONG_IDENTIFIER: 'Identifier must be an Email or a Card',
      WRONG_CREDENTIALS: 'No user found with this credentials',
      WRONG_TOKEN: 'Link is wrong or has been expired'
    },


    /**
     * COMMON-PAGES TRANSLATION (Μετάφραση Κοινών Σελίδων)
     */
    HISTORY: {
      SUBMENU: {
        LOYALTY: 'Loyalty Transactions',
        MICROCREDIT: 'Microcredit Transactions'
      },
      BASKET: 'Basket',
      TRANSACTIONS: 'Your Recent Transactions',
      RECEIPT: 'Receipt',
      OFFER: 'Offer',
      CAMPAIGN: 'Campaign',
      SUPPORT: 'Support',
      POINTS: 'Points',
      TOKENS: 'Tokens',
      PARTNER: 'Partner',
      MEMBER: 'To',
      PAID: 'Payment Confirmation',
      UNPAID: 'Payment Withdrawal',
    },
    SETTINGS: {
      SUBMENU: {
        PERSONAL_INFORMATION: 'Personal Information',
        CHANGE_PASSWORD: 'Change Password',
        ACCOUNT_SETTINGS: 'Account Settings',
        INVITATION: 'Invite a friend'
      },
      ACCOUNT: 'Account',
      PERSONAL_INFO: 'Setup Your Personal Information',
      CHANGE_PASSWORD: 'Update Your Password',
      DEACTIVATE: 'Deactivate Account',
      DEACTIVATE_CONFRIRM: 'Are you sure that you want to deactivate your account',
      INVITATION: 'Submit your friend\'s email and we will send an invite',
      CANCEL: 'Cancel',
    },


    /**
     * ITEMS - OFFER, POST, EVENT, CAMPAIGN - TRANSLATION (Μετάφραση Ειδών - Προσφορά, Ανάρτηση, Εκδήλωση, Καμπάνια - )
     */
    OFFER: {
      TITLE: 'OFFER',
      PLURAL: 'Offers',
      ALL: 'All Offers',
      CREATE: 'Add New Offer',
      CREATE_SUB: 'Create a new Offer',
      EDIT: 'Edit Offer',
      DELETE: 'Delete Offer',
      DELETE_CONFIRM: 'Are you sure that you want to delete ',
      CANCEL: 'Cancel',
      STATUS: {
        EXPIRED: 'Expired'
      }
    },
    POST: {
      TITLE: 'POST',
      PLURAL: 'Posts',
      CREATE: 'Add New Post',
      CREATE_SUB: 'Create a new Post',
      EDIT: 'Edit Post',
      DELETE: 'Delete Post',
      DELETE_CONFIRM: 'Are you sure that you want to delete ',
      CANCEL: 'Cancel'
    },
    EVENT: {
      TITLE: 'EVENT',
      PLURAL: 'Events',
      CREATE: 'Add New Event',
      CREATE_SUB: 'Create a new Event',
      EDIT: 'Edit Event',
      DELETE: 'Delete Event',
      DELETE_CONFIRM: 'Are you sure that you want to delete ',
      CANCEL: 'Cancel'
    },
    POST_EVENT: {
      PLURAL: 'News & Events',
      ALL: 'All News & Events',
    },
    CAMPAIGN: {
      TITLE: 'CAMPAIGN',
      PLURAL: 'Campaigns',
      ALL: 'All Campaigns',
      CREATE: 'Add New Microcredit Campaign',
      CREATE_SUB: 'Create a new Microcredit Campaign',
      EDIT: 'Edit Campaign',
      DELETE: 'Delete Campaign',
      DELETE_CONFIRM: 'Are you sure that you want to delete ',
      PUBLISH: 'Publish Campaign',
      PUBLISH_CONFIRM_A: 'Are you sure you would like to publish the campaign',
      PUBLISH_CONFIRM_B: 'You won\'t be able to make any further changes after your campaign has been published',
      DRAFT: 'draft',
      CANCEL: 'Cancel',

      REDEEM_PERIOD: 'Redeem Period',
      REDEEM_PERIOD_SUB: 'This is the period in which you can get the items you pledged for',
      PRICE: 'Price',
      PRICE_PER_ITEM: 'Price per item',
      PLEDGE: 'Pledge',
      PLEDGE_DISABLE: 'You cannot add a "Pledge" outside the supporting period',
      REDEEM_DISABLE: 'You cannot redeem a "Support" outside the redemption period',
      PARTNER: 'Partner Info',
      TERMS: 'What do I get?',
      STATUS: {
        DRAFT: 'Draft',
        EXPECTED: 'Is Expected',
        EXPIRED: 'Expired',
        REDEEM_TO: 'redeem until'
      },
    },
    SUPPORT: {
      REMAINING: 'Remain',
      PAYMENT_METHOD: 'Payment Method',
      PAYMENT_DETAILS: 'Details',
      CHANGE_STATUS_TOOLTIP: 'Cannot Revert a Payment as Redeeming Period in on',
      PAYMENT: {
        STORE: 'At Store',
        BANK: 'Bank Deposit'
      },
      STATUS: {
        CONFIRMED: 'Confirmed',
        CONFIRMED_TOOLTIP: 'Payment has been Confirmed',
        PENDING: 'Pending',
        PENDING_TOOLTIP: 'Payment has not been confirmed yet',
        COMPLETED: 'Completed',
        COMPLETED_TOOLTIP: 'Has been total redeemed',
      },
      FILTER: {
        TEXT: {
          TITLE: 'Search by...',
          PLACEHOLDER: 'Payment ID'
        },
        SELECT: {
          TITLE: 'Payment Method'
        },
        DATE: {
          TITLE: 'Date'
        }
      },
      ARRAY: {
        PAYMENT_ID: 'Payment ID',
        METHOD: 'Payment Method',
        INITIAL_TOKENS: 'Initial Tokens',
        REMAINING_TOKENS: 'Remaining Tokens',
        DATE: 'Registration Date',
        STATUS: 'Payment Status'
      }
    },

    /**
     * CONTENT TRANSLATION (Μετάφραση Στατικού Περιεχομένου)
     */
    CONTENT: {
      PLURAL: 'Content',
      CREATE: 'Add new Content',
      CREATE_SUB: 'Create a new content',
      EDIT: 'Edit Content',
    },

    /**
     * USERS TRANSLATION (Μετάφραση Χρηστών)
     */
    USER: {
      PLURAL: 'Users',
      REACTIVATE: 'Reactivate',
      REACTIVATE_DISABLE: 'User is activated',
      PARTNER: {
        PLURAL: 'Partners',
        ALL: 'All Partners',
        CREATE: 'Add New Partner',
        CREATE_SUB: 'Create a new partner of our community',
      },
      MEMBER: {
        CREATE: 'Add New Member',
        CREATE_SUB: 'Create a new member of our community'
      },
      FILTER: {
        TITLE: 'Search by...',
        PARTNER_PLACEHOLDER: 'User ID, Email, Name',
        MEMBER_PLACEHOLDER: 'User ID, Email, Card Number'
      },
      ARRAY: {
        USER_ID: 'User ID',
        EMAIL: 'Email',
        NAME: 'Name',
        CARD: 'Card Number',
        DATE: 'Registration Date',
        STATUS: 'Status'
      }
    },


    /**
     * MEMBER-PAGES TRANSLATION (Μετάφραση Σελίδων Μέλους)
     */
    MEMBER: {
      DASHBOARD: {
        QR_CODE: 'Your QR Code',
        WALLET_TITLE: 'My Wallet',
        WALLET_SUBTITLE: 'across the network',
      },
      WIZARD: {
        NEXT_STEP: 'Go to next step',
        CLOSE: 'Κλείσιμο',

        SUB_AMOUNT: {
          PLEDGE: 'Pledge you Support',
          AMOUNT: 'Amount',
          PAYMENT: 'Payment Method'
        },
        SUB_FINAL: {
          AMOUNT: 'Transaction\'s Amount ',
          PAYMENT: 'Payment Method',
          PAYMENT_ID: 'Payment ID',
          INSTRUCTIONS: 'Instructions'
        }
      }
    },


    /**
     * PARTNER-PAGES TRANSLATION (Μετάφραση Σελίδων Συνεργάτη)
     */
    PARTNER: {
      DASHBOARD: {
        SCANNER: 'Scanner',
        NEWS: 'News from the Community',
      },
      WIZARD: {
        NEXT_STEP: 'Go to next step',
        PREVIOUS_STEP: 'Go back',
        CLOSE: 'Close Window',

        LOYALTY_TITLE: 'Scan for Points',
        BACK_TO_SCANNER: 'Back to Scanner',
        COMPLETE: 'Complete Transaction',
        SCAN_LOYALTY: {
          HEADING: 'Scan a new Card, Scan User App, Scan User Card',
          ALT_PROMPT: 'Identifier',
        },
        SUB_IDENTIFIER_FORM: {
          HEADING: 'Identifier Form',
          TITLE: 'Identifier',
          HINT: 'Please enter email or card number.'
        },
        SUB_EMAIL_FORM: {
          HEADING: 'Enter a member E-mail',
          HINT: 'Please enter client\'s email address.'
        },
        SUB_AMOUNT_FORM: {
          HEADING: 'Transaction amount',
          TITLE: 'Amount',
          HINT: 'Please enter transaction amount.',
          PAID: 'Paid?'
        },
        SUB_DISCOUNT_FORM: {
          HEADING: 'Transaction amount',
          TITLE: 'You can have a discount of',
          CTA: 'Check to Redeem discount'
        },
        SUB_FINAL_STEP: {
          AMOUNT: 'Transaction Amount',
          DISCOUNT_AMOUNT: 'Discount Amount',
          POINTS_TO_REDEEM: 'Points to Redeem',
          POINTS_REMAINING: 'Total Points',
          POINTS_ADDED: 'New Points',
          QUANTITY: 'Quantity',
          TOKENS_BEFORE: 'Initial Tokens',
          TOKENS_REDEEMED: 'Tokens Redeemed',
          TOKENS_REMAINING: 'Tokens Remaining',
          PAYMENT_ID: 'Payment ID'
        },
        SUB_OFFER_FORM: {
          HEADING_MAIN: 'Offer\'s Transaction Details',
          OFFER: 'Offer',
          OFFER_ID: 'Offer ID',
          SUB_HEADING: 'Points',
          COST: 'required',
          POINTS: 'available',
          FORM_TITLE: 'Quantity',
          FORM_HINT: 'Please enter transaction\'s quantity.',
          ALERT: 'Not enough points. Unable to proceed.'
        },
        SUB_MICROCREDIT_FORM: {
          HEADING_MAIN: 'Microcredit Campaign\'s Transaction Details',
          CAMPAIGN: 'Microcredit Campaign',
          CAMPAIGN_ID: 'Campaign ID',
          SUB_HEADING: 'Supports List',
          SUB_HEADING_2: 'Tokens',
          SUB_HEADING_3: 'History',
          SUPPORT_ID: 'Support ID',
          INITIAL: 'initial',
          REDEEMED: 'redeemed',
          REMAINING: 'remaining',
          FORM_TITLE: 'Tokens',
          FORM_HINT: 'Please enter transaction\'s tokens.',
          ALERT: 'No Transactions. Unable to proceed.',
        }
      }
    },


    /**
     * WIZARD(STEPPER) MESSAGES TRANSLATION (Μετάφραση Μηνυμάτων Stepper)
     */
    WIZARD_MESSAGES: {
      ERROR: 'Something went wrong',
      ERROR_TRANSACTION: 'Transaction failed',

      ERROR_REGISTRATION: 'Error during registration',
      ERROR_LINK_EMAIL: 'Error during linking email',
      ERROR_LINK_CARD: 'Error during linking card',
      EMAIL_HAS_CARD: 'A card is already linked to this account',

      ERROR_EARN_POINTS: '',
      ERROR_REDEEM_POINTS: '',
      ERROR_REDEEM_OFFER: '',
      ERROR_EARN_TOKENS: '',
      ERROR_REDEEM_TOKENS: '',

      NOT_ENOUGH_POINTS: 'Unable to procced <br> Not enough points',
      NOT_ENOUGH_TOKENS: 'Unable to procced <br> Not enough tokens',

      // Step A
      NEW_EMAIL: 'A New email detected',
      NEW_CARD: 'New Card Number Detected<br>Please enter an existing Email address to link! If not, ask email to register! Or procced and create a card account',
      EXISTING_CARD: 'An Existing Card Number Detected<br>Link an Email or continue',

      EMAIL_WILL_LINK: 'Email address will link with the card',
      CARD_WILL_LINK: 'Card will link with email address',
      NO_EMAIL_WILL_LINK: 'No email will link\nThe process will continue with a card',

      USER_CREATED: 'A new user has been created',
      USER_CREATED_CARD: 'A new user created only card',
      USER_CREATED_EMAIL: 'A new user has been created only email',
      LINK_EMAIL: 'A new email address has been linked to an existing account',
      LINK_CARD: 'A new card has been linked to an existing account',

      SUCCESS_TRANSACTION: 'Transaction completed successfully',
    }
  }
};





/**
 * ADMIN-PAGES TRANSLATION (Μετάφραση Σελίδων Διαχειριστή)
 */


        // COMMUNITY: {
        //     TITLE: 'COMMUNITY',
        //     SUBTITLE: 'Meet our partners!',
        //     DESC: 'Who we are!'
        // },
        // BALANCE: {
        //     TITLE: 'BALANCE',
        //     SUBTITLE: 'across the network',
        // },
        // QR: {
        //     TITLE: 'This is your QR code',
        // },

        // PAGES: {
        //     COMMUNITY: {
        //         OUR_COMMUNITY: 'Our Community!',
        //         CURRENT_OFFERS: 'Current offers!',
        //         LATEST_POSTS: 'Latest Posts & Upcoming Events!',
        //         OFFER_DESCRIPTION: 'Offer Description',
        //         MEMBER_SINCE: 'Member Since:',
        //         SINCE: 'Since',
        //         UNTIL: 'Until',
        //         POINTS_REQUIRED: 'Points Required',
        //         POINTS: 'Points:',
        //         EXPIRATION: 'Expires:',
        //         POST: 'Post',
        //         EVENT: 'Event',
        //     }
        // },
        // LISTS: {
        //     PARTNER_LIST: 'Cooperatives',
        //     PARTNER_LIST_LINK: 'All Cooperatives'
        // },
