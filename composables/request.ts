import { toast } from 'vue-sonner';

import type { AsyncData, UseFetchOptions } from 'nuxt/app';
import type { RuntimeConfig } from 'nuxt/schema';
import type { FetchError } from 'ofetch';

const showToastFromError = (error: FetchError<AppError>) => {
  // do not show toast on server side
  if (typeof window === 'undefined') return;
  if (error.data?.code) {
    const { code, title, message, validationErrors } = error.data;
    if (
      code === ErrorCodes.UNAUTHORIZED ||
      code === ErrorCodes.SHOWABLE_ERROR
    ) {
      toast.error(title, {
        description: message,
      });
    }
    if (code === ErrorCodes.SHOWABLE_SUCCESS) {
      toast.success(title, {
        description: message,
      });
    }
    if (code === ErrorCodes.VALIDATION_ERROR && validationErrors) {
      const errorMessage = Object.values(validationErrors).join(', ');
      toast.error(message, {
        description: errorMessage,
      });
    }
  }
};

// show toast from response pattern like { success: boolean, message: string }
const showToastFromSuccess = (data: any) => {
  // do not show toast on server side
  if (typeof window === 'undefined') return;
  if (
    typeof data === 'object' &&
    typeof data?.success === 'boolean' &&
    typeof data?.message === 'string'
  ) {
    if (data.success) {
      toast.success('Success', { description: data.message });
    } else {
      toast.error('Error', { description: data.message });
    }
  }
};

const createClient = (config: RuntimeConfig, token: string | null) => {
  return $fetch.create({
    baseURL: `${config.public.apiUrl || ''}/v1/app`,
    // baseURL: config.public.apiUrl || '' + '/v1/app',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token || '',
      'X-FRONTEND': 'customer',
    },
  });
};

export const useFetchRequest = async <T = any>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
  requestOptions?: RequestOptions,
) => {
  const { token } = useAuthSession();
  const config = useRuntimeConfig();

  if (!options) {
    options = {};
  }
  if (!options?.signal) {
    options.signal = new AbortController().signal;
  }

  requestOptions = { ...{ toast: true }, ...(requestOptions || {}) };

  const $http = createClient(config, token.value);

  // @ts-expect-error type mismatch from nuxt. maybe fixed in future versions
  const response = (await useFetch<T, FetchError<AppError>>(url, {
    ...options,
    $fetch: $http,
  })) as AsyncData<T, FetchError<AppError>>;

  if (requestOptions?.toast) {
    if (response.error.value) {
      showToastFromError(response.error.value);
    } else if (response.data.value) {
      showToastFromSuccess(response.data.value);
    }
  }

  return response;
};

export const useClientRequest = (url: string | (() => string)) => {
  const config = useRuntimeConfig();
  const { token } = useAuthSession();

  const loading = ref(false);
  const loadingById = ref(false);
  const postRequestLoading = ref(false);
  const patchRequestLoading = ref(false);
  const deleting = ref(false);

  const firstTimeLoading = ref(true);
  const firstTimeLoadingSingle = ref(true);

  const getRequestSignal = new AbortController().signal;
  const getByIdRequestSignal = new AbortController().signal;
  const postRequestSignal = new AbortController().signal;
  const patchRequestSignal = new AbortController().signal;
  const deleteRequestSignal = new AbortController().signal;

  const lastGetRequestData = ref();
  const lastgetByIdRequestData = ref();
  const lastPostRequestData = ref();
  const lastPatchRequestData = ref();
  const lastDeleteRequestData = ref();

  const getRequest = async <T = any>(
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
  ) => {
    requestOptions = {
      ...{ defaultReturnValue: [] as T, toast: true },
      ...(requestOptions || {}),
    };
    const path = resolvePath();

    return await extractRequest<T>(
      path,
      'GET',
      getRequestSignal,
      loading,
      lastGetRequestData,
      options,
      requestOptions,
      firstTimeLoading,
    );
  };

  const getByIdRequest = async <T = any>(
    id?: string | number,
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
  ) => {
    requestOptions = {
      ...{ defaultReturnValue: null as T, toast: true },
      ...(requestOptions || {}),
    };
    const path = resolvePath(id);

    return await extractRequest<T>(
      path,
      'GET',
      getByIdRequestSignal,
      loadingById,
      lastgetByIdRequestData,
      options,
      requestOptions,
      firstTimeLoadingSingle,
    );
  };

  const postRequest = async <T = any>(
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
  ) => {
    requestOptions = {
      ...{ defaultReturnValue: null as T, toast: true },
      ...(requestOptions || {}),
    };
    const path = resolvePath();

    return await extractRequest<T>(
      path,
      'POST',
      postRequestSignal,
      postRequestLoading,
      lastPostRequestData,
      options,
      requestOptions,
    );
  };

  const patchRequest = async <T = any>(
    id?: string | number,
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
  ) => {
    requestOptions = {
      ...{ defaultReturnValue: null as T, toast: true },
      ...(requestOptions || {}),
    };
    const path = resolvePath(id);

    return await extractRequest<T>(
      path,
      'PATCH',
      patchRequestSignal,
      patchRequestLoading,
      lastPatchRequestData,
      options,
      requestOptions,
    );
  };

  const deleteRequest = async <T = boolean>(
    id?: string | number,
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
  ) => {
    requestOptions = {
      ...{ defaultReturnValue: false as T, toast: true },
      ...(requestOptions || {}),
    };
    const path = resolvePath(id);

    const data = await extractRequest<T>(
      path,
      'DELETE',
      deleteRequestSignal,
      deleting,
      lastDeleteRequestData,
      options,
      requestOptions,
    );
    return data ? true : false;
  };

  const resolvePath = (id?: string | number) => {
    const basePath = typeof url === 'function' ? url() : url;
    return `${basePath}${id ? `/${id}` : ''}`;
  };

  const extractRequest = async <T = any>(
    path: string,
    method: UseFetchOptions<T>['method'],
    signal: AbortSignal,
    loadingState: Ref<boolean>,
    lastRequestData?: Ref<T>,
    options?: UseFetchOptions<T>,
    requestOptions?: ClientRequestOptions<T>,
    firstLoadingState?: Ref<boolean>,
  ) => {
    if (!options) {
      options = {};
    }
    options.method = method;

    if (!options?.signal) {
      options.signal = signal;
    }
    options.headers = {
      ...(options?.headers || {}),
      Authorization: token.value || '',
    };

    loadingState.value = true;
    try {
      const $http = createClient(config, token.value);
      // @ts-expect-error type mismatch from nuxt. maybe fixed in future versions
      const data = await $http<T>(path, options);

      loadingState.value = false;
      if (firstLoadingState) {
        firstLoadingState.value = false;
      }
      if (lastRequestData && isRef(lastRequestData)) {
        lastRequestData.value = data;
      }
      if (requestOptions?.toast && data) {
        showToastFromSuccess(data);
      }

      return data as T;
    } catch (err) {
      const error = err as FetchError<AppError>;

      loadingState.value = false;
      if (firstLoadingState) {
        firstLoadingState.value = false;
      }

      if (requestOptions?.toast && error?.data && error?.data?.code) {
        showToastFromError(error);
      }

      if (error?.name === 'AbortError') {
        return (
          lastRequestData && lastRequestData.value
            ? lastRequestData.value
            : requestOptions?.defaultReturnValue
        ) as T;
      }
      return requestOptions?.defaultReturnValue as T;
    }
  };

  return {
    loading,
    loadingById,
    postRequestLoading,
    patchRequestLoading,
    deleting,

    firstTimeLoading,
    firstTimeLoadingSingle,

    getRequest,
    getByIdRequest,
    postRequest,
    patchRequest,
    deleteRequest,
  };
};
