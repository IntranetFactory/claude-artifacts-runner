import * as React from 'react';
import * as Recharts from 'recharts';
import * as Accordion from '@/components/ui/accordion';
import * as AlertDialog from '@/components/ui/alert-dialog';
import * as Alert from '@/components/ui/alert';
import * as AspectRatio from '@/components/ui/aspect-ratio';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Breadcrumb from '@/components/ui/breadcrumb';
import * as Button from '@/components/ui/button';
import * as Calendar from '@/components/ui/calendar';
import * as Card from '@/components/ui/card';
import * as Carousel from '@/components/ui/carousel';
import * as Chart from '@/components/ui/chart';
import * as Checkbox from '@/components/ui/checkbox';
import * as Collapsible from '@/components/ui/collapsible';
import * as Command from '@/components/ui/command';
import * as ContextMenu from '@/components/ui/context-menu';
import * as Dialog from '@/components/ui/dialog';
import * as Drawer from '@/components/ui/drawer';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import * as Form from '@/components/ui/form';
import * as HoverCard from '@/components/ui/hover-card';
import * as InputOtp from '@/components/ui/input-otp';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Menubar from '@/components/ui/menubar';
import * as NavigationMenu from '@/components/ui/navigation-menu';
import * as Pagination from '@/components/ui/pagination';
import * as Popover from '@/components/ui/popover';
import * as Progress from '@/components/ui/progress';
import * as RadioGroup from '@/components/ui/radio-group';
import * as Resizable from '@/components/ui/resizable';
import * as ScrollArea from '@/components/ui/scroll-area';
import * as Select from '@/components/ui/select';
import * as Separator from '@/components/ui/separator';
import * as Sheet from '@/components/ui/sheet';
import * as Skeleton from '@/components/ui/skeleton';
import * as Slider from '@/components/ui/slider';
import * as Sonner from '@/components/ui/sonner';
import * as Switch from '@/components/ui/switch';
import * as Table from '@/components/ui/table';
import * as Tabs from '@/components/ui/tabs';
import * as Textarea from '@/components/ui/textarea';
import * as Toast from '@/components/ui/toast';
import * as Toaster from '@/components/ui/toaster';
import * as ToggleGroup from '@/components/ui/toggle-group';
import * as Toggle from '@/components/ui/toggle';
import * as Tooltip from '@/components/ui/tooltip';
import * as UseToast from '@/components/ui/use-toast';
import * as LibUtil from '@/lib/utils';
import * as lucideReact from 'lucide-react';
import ApiAccess from '@/components/apiAccess';

import { transform } from 'sucrase';

// Allowed modules provided by the host app
const allowedModules = {
  react: React,
  recharts: Recharts,
  '@/components/ui/accordion': Accordion,
  '@/components/ui/alert-dialog': AlertDialog,
  '@/components/ui/alert': Alert,
  '@/components/ui/aspect-ratio': AspectRatio,
  '@/components/ui/avatar': Avatar,
  '@/components/ui/badge': Badge,
  '@/components/ui/breadcrumb': Breadcrumb,
  '@/components/ui/button': Button,
  '@/components/ui/calendar': Calendar,
  '@/components/ui/card': Card,
  '@/components/ui/carousel': Carousel,
  '@/components/ui/chart': Chart,
  '@/components/ui/checkbox': Checkbox,
  '@/components/ui/collapsible': Collapsible,
  '@/components/ui/command': Command,
  '@/components/ui/context-menu': ContextMenu,
  '@/components/ui/dialog': Dialog,
  '@/components/ui/drawer': Drawer,
  '@/components/ui/dropdown-menu': DropdownMenu,
  '@/components/ui/form': Form,
  '@/components/ui/hover-card': HoverCard,
  '@/components/ui/input-otp': InputOtp,
  '@/components/ui/input': Input,
  '@/components/ui/label': Label,
  '@/components/ui/menubar': Menubar,
  '@/components/ui/navigation-menu': NavigationMenu,
  '@/components/ui/pagination': Pagination,
  '@/components/ui/popover': Popover,
  '@/components/ui/progress': Progress,
  '@/components/ui/radio-group': RadioGroup,
  '@/components/ui/resizable': Resizable,
  '@/components/ui/scroll-area': ScrollArea,
  '@/components/ui/select': Select,
  '@/components/ui/separator': Separator,
  '@/components/ui/sheet': Sheet,
  '@/components/ui/skeleton': Skeleton,
  '@/components/ui/slider': Slider,
  '@/components/ui/sonner': Sonner,
  '@/components/ui/switch': Switch,
  '@/components/ui/table': Table,
  '@/components/ui/tabs': Tabs,
  '@/components/ui/textarea': Textarea,
  '@/components/ui/toast': Toast,
  '@/components/ui/toaster': Toaster,
  '@/components/ui/toggle-group': ToggleGroup,
  '@/components/ui/toggle': Toggle,
  '@/components/ui/tooltip': Tooltip,
  '@/components/ui/use-toast': UseToast,
  '@/components/apiAccess': ApiAccess,
  '@/lib/utils': LibUtil,
  'lucide-react': lucideReact
};
 
const ErrorDisplay = ({ error }) => (
  <div className="p-4 border-2 border-red-500 rounded-md bg-red-50">
    <h3 className="text-red-700 font-semibold mb-2">Transformation Error</h3>
    <pre className="text-sm text-red-600 whitespace-pre-wrap">
      {error.message || 'Failed to transform JSX code'}
    </pre>
  </div>
);

// Add ErrorBoundary component at top
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-red-500 rounded-md bg-red-50">
          <h3 className="text-red-700 font-semibold mb-2">Render Error</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {this.state.error?.message || 'Invalid component rendered'}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Custom `require` function
const require = (specifier) => {
  if (allowedModules[specifier]) {
    return allowedModules[specifier];
  }
  throw new Error(`Module "${specifier}" is not allowed or cannot be resolved.`);
};

// Function to dynamically load and execute a module
const loadModule = (sourceCode) => {
  // Transform the code with Sucrase
  const transformedCode = transform(sourceCode, {
    transforms: ['imports', 'jsx'], // Ensure it handles ESM and JSX
  }).code;

  // Create a function to execute the transformed code
  const moduleFunction = new Function('require', 'exports', 'module', transformedCode);

  const exports = {};
  const module = { exports };

  // Execute the transformed module
  moduleFunction(require, exports, module);

  // Return the default export if it exists, otherwise return all exports
  return module.exports.default || module.exports;
};



const DynamicComponent = React.memo(({ code }) => {
  if (!code) return null;

  try {    
    const func = loadModule(code);
    
    // Type checking
    if (typeof func !== 'function') {
      throw new Error('Component must be a function');
    }

    return (
      <ErrorBoundary>
        {func()}
      </ErrorBoundary>
    );
  } catch (error) {    
    return <ErrorDisplay error={error} />;
  }
}, (prevProps, nextProps) => {
  return prevProps.code === nextProps.code;
});

export default DynamicComponent;
