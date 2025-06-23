import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const useBudget = () => {
    const { session } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!session) return;

        setLoading(true);
        setError('');
        try {
            const { data: accountsData, error: accountsError } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', session.user.id);

            if (accountsError) throw accountsError;
            setAccounts(accountsData || []);

            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (transactionsError) throw transactionsError;
            setTransactions(transactionsData || []);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load dashboard data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session, fetchData]);

    const addTransaction = async (transactionDetails) => {
        if (!session) return;

        const { newTransaction, accountId } = transactionDetails;
        const { amount } = newTransaction;
        
        const targetAccount = accounts.find(acc => acc.id === accountId);

        if(!targetAccount) {
            setError("Selected account not found.");
            return;
        }

        const { error: transError } = await supabase
            .from('transactions')
            .insert([{ ...newTransaction, user_id: session.user.id, account_id: accountId }]);

        if (transError) {
            setError(transError.message);
            console.error("Error inserting transaction:", transError);
            return;
        }

        const newBalance = parseFloat(targetAccount.balance) + amount;
        const { error: accountError } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId);
        
        if (accountError) {
            setError(accountError.message);
            console.error("Error updating account:", accountError);
            return;
        }

        await fetchData();
    };

    return { accounts, transactions, loading, error, addTransaction, retry: fetchData };
}; 