import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaLandmark, FaPiggyBank, FaCreditCard, FaPlus, FaTimes } from 'react-icons/fa';
import { useBudget } from '../../hooks/useBudget';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const BudgetDashboard = () => {
    const { accounts, transactions, loading, error, addTransaction, retry } = useBudget();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTransaction = async (transactionDetails) => {
        await addTransaction(transactionDetails);
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
                    onRetry={retry} 
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
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">Welcome! Your default accounts are ready.</p>
                                <p className="text-gray-500 text-sm">Add a transaction to get started.</p>
                             </div>
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
                                        {t.amount >= 0 ? '+' : ''}${(t.amount || 0).toFixed(2)}
                                    </p>
                                </li>
                            )) : (
                                <p className="text-gray-400 text-center mt-8 text-sm sm:text-base">No transactions yet.</p>
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
            alert("Please select an account. If you see no accounts, please refresh the page.");
            return;
        }
        const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount) || 0) : Math.abs(parseFloat(amount) || 0);
        const newTransaction = { title, subtitle, amount: finalAmount, date: new Date().toISOString() };
        onAddTransaction({ newTransaction, accountId });
    };

    const titlePlaceholder = type === 'income' ? "Title (e.g., Paycheck)" : "Title (e.g., Coffee)";
    const subtitlePlaceholder = type === 'income' ? "Subtitle (e.g., From work)" : "Subtitle (e.g., Starbucks)";

    if (accounts.length === 0) {
       return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
             <motion.div
                className="bg-dark-bg border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-md text-white text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-xl font-bold mb-4">No Accounts Available</h2>
                <p className="mb-6">It seems you don't have any accounts. Your default accounts should appear shortly after a page refresh.</p>
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