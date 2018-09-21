/**
 * Created by abbeymart on 2017-01-15.
 */

// Configurations / settings
import './settings';

// MySQL DB, not used currently:
// import './mysql';

// PostgreSQL DB (using pg-promise), under consideration:

// Publications
import '../../server/publications/central';
import '../../server/publications/asset';

// Methods
import '../../server/methods/central';
import '../../server/methods/asset';
import '../../server/methods/pam';
import '../../server/methods/mpe';
import '../../server/methods/sdm';
import '../../server/methods/hcm';
import '../../server/methods/fin';
import '../../server/methods/hms';
import '../../server/methods/ems';

// APIs
import '../../server/api';

// Apollo server
// import './apolloServer';

// TODO: server-side-rendering (SSR)

// Email templates
import './email';
