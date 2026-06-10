import { useState, useEffect, useCallback } from 'react';
import { getPaymentMatrix } from '../api';
import type { GetPaymentMatrixResponse } from '../types';
import { toast } from '@/stores/useToastStore';
import { handleApiError } from '@/utils/apiErrorHelper';

export const usePaymentMatrix = (year: number) => {
    const [data, setData] = useState<GetPaymentMatrixResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchMatrix = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getPaymentMatrix(year);
            setData(response);
        } catch (err) {
            toast.error(await handleApiError(err, 'Failed to fetch matrix'));
        } finally {
            setIsLoading(false);
        }
    }, [year]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMatrix();
    }, [fetchMatrix]);

    return { data, isLoading, refetch: fetchMatrix };
};
