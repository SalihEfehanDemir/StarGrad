import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaLandmark, FaPiggyBank, FaCreditCard, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const BudgetDashboard = () => {
    const { session } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!session) return;

        setLoading(true);
        setError('');
        try {
            // Fetch accounts for the current user
            let { data: accountsData, error: accountsError } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', session.user.id);

            if (accountsError) throw accountsError;

            // If user has no accounts, create default ones for them
            if (accountsData && accountsData.length === 0) {
                const defaultAccounts = [
                    { name: 'Checking', balance: 0, user_id: session.user.id, type: 'checking' },
                    { name: 'Savings', balance: 0, user_id: session.user.id, type: 'savings' }
                ];
                const { data: newAccountsData, error: insertError } = await supabase
                    .from('accounts')
                    .insert(defaultAccounts)
                    .select();

                if (insertError) throw insertError;
                accountsData = newAccountsData;
            }
            
            setAccounts(accountsData);

            // Fetch transactions for the current user
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (transactionsError) throw transactionsError;

            setTransactions(transactionsData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleAddTransaction = async (transactionDetails) => {
        if (!session) return;

        const { newTransaction, accountId } = transactionDetails;
        const { amount } = newTransaction;
        
        const targetAccount = accounts.find(acc => acc.id === accountId);

        if(!targetAccount) {
            setError("Selected account not found.");
            return;
        }

        // 1. Insert new transaction linked to the account
        const { error: transError } = await supabase
            .from('transactions')
            .insert([{ ...newTransaction, user_id: session.user.id, account_id: accountId }]);

        if (transError) {
            setError(transError.message);
            console.error("Error inserting transaction:", transError)
            return;
        }

        // 2. Update account balance
        const newBalance = parseFloat(targetAccount.balance) + amount;
        const { error: accountError } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId);
        
        if (accountError) {
            setError(accountError.message);
            console.error("Error updating account:", accountError);
            // Note: Here you might want to handle the inconsistent state,
            // e.g., by trying to delete the transaction that was just created.
            // For now, we'll just show the error.
            return;
        }

        // 3. Refresh data to show changes
        await fetchData();
        setIsModalOpen(false);
    };

    const netWorth = accounts.reduce((total, acc) => total + parseFloat(acc.balance), 0);

    const getAccountIcon = (type) => {
        const typeStr = type || 'checking';
        if (typeStr.toLowerCase().includes('checking')) return <FaLandmark />;
        if (typeStr.toLowerCase().includes('savings')) return <FaPiggyBank />;
        if (typeStr.toLowerCase().includes('credit')) return <FaCreditCard />;
        return <FaLandmark />;
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 h-screen">
                <LoadingSpinner className="h-full" size="xl" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 pt-24">
                <ErrorMessage 
                    message={error} 
                    onRetry={() => fetchData()} 
                    className="max-w-md mx-auto"
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 pt-20 sm:pt-24">
            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* Net Worth & Accounts */}
                    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-gray-400 mb-2">Net Worth</h2>
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Accounts</h2>
                        {accounts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {accounts.map(acc => (
                                    <div key={acc.id} className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-brand-blue">{getAccountIcon(acc.type)}</div>
                                            <h3 className="font-semibold text-gray-300 text-sm sm:text-base">{acc.name}</h3>
                                        </div>
                                        <p className={`text-lg sm:text-xl font-semibold mt-2 ${acc.balance < 0 ? 'text-red-400' : 'text-white'}`}>
                                            ${parseFloat(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No accounts found. Your default accounts will be created shortly.</p>
                        )}
                    </div>
                </div>

                {/* Transactions */}
                <div className="lg:col-span-1">
                    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-4 sm:p-6 h-full min-h-[300px] sm:min-h-[400px]">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Recent Transactions</h2>
                        <ul className="space-y-3">
                            {transactions.length > 0 ? transactions.map(t => (
                                <li key={t.id} className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-transparent hover:border-brand-blue transition-colors">
                                    <div className="min-w-0 flex-1 mr-3">
                                        <p className="font-semibold text-white text-sm sm:text-base truncate">{t.title}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 truncate">{t.subtitle}</p>
                                    </div>
                                    <p className={`font-semibold text-sm sm:text-base flex-shrink-0 ${t.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                                    </p>
                                </li>
                            )) : (
                                <p className="text-gray-400 text-center mt-8 text-sm sm:text-base">No transactions yet. Add one!</p>
                            )}
                        </ul>
                    </div>
                </div>
            </motion.div>
            
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 bg-brand-blue text-white w-16 h-16 rounded-full flex items-center justify-center shadow-glow-blue hover:shadow-glow-blue-hover transition-all duration-300">
                <FaPlus size="1.5em" />
            </button>

            {isModalOpen && <TransactionModal accounts={accounts} onAddTransaction={handleAddTransaction} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const TransactionModal = ({ accounts, onAddTransaction, onClose }) => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [accountId, setAccountId] = useState(accounts.length > 0 ? accounts[0].id : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!accountId) {
            alert("Please select an account.");
            return;
        }
        const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount) || 0) : Math.abs(parseFloat(amount) || 0);
        const newTransaction = { title, subtitle, amount: finalAmount, date: new Date().toISOString() };
        onAddTransaction({ newTransaction, accountId });
    };

    const titlePlaceholder = type === 'income' ? "Title (e.g., Paycheck)" : "Title (e.g., Coffee)";
    const subtitlePlaceholder = type === 'income' ? "Subtitle (e.g., From work)" : "Subtitle (e.g., Starbucks)";

    if (accounts.length === 0 && !accountId) {
       return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
             <motion.div
                className="bg-dark-bg border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-md text-white text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-xl font-bold mb-4">No Accounts Found</h2>
                <p className="mb-6">You need at least one account to add a transaction. Your default accounts should be available shortly.</p>
                <button onClick={onClose} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Close</button>
            </motion.div>
         </div>
       );
    }


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                className="bg-dark-bg border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">New Transaction</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center space-x-4 mb-4">
                        <button type="button" onClick={() => setType('expense')} className={`px-4 py-2 rounded-lg font-bold ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}>Expense</button>
                        <button type="button" onClick={() => setType('income')} className={`px-4 py-2 rounded-lg font-bold ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>Income</button>
                    </div>
                     <select value={accountId} onChange={e => setAccountId(e.target.value)} required className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-brand-blue">
                        <option value="" disabled>Select an Account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name} (${parseFloat(acc.balance).toFixed(2)})
                            </option>
                        ))}
                    </select>
                    <input type="text" placeholder={titlePlaceholder} value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-brand-blue" />
                    <input type="text" placeholder={subtitlePlaceholder} value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-brand-blue" />
                    <input type="number" step="0.01" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-brand-blue" />
                    <button type="submit" className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-hover">Add Transaction</button>
                </form>
            </motion.div>
        </div>
    );
}

export default BudgetDashboard; 