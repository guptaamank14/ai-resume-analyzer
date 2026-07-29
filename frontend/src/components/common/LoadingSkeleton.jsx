import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 bg-white dark:bg-slate-900 shadow-sm">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 rounded-xl">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4 items-center justify-between py-2.5">
          <div className="flex items-center space-x-3 w-1/2">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="space-y-1.5 w-full">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3.5 w-2/5" />
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export const AnalysisSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 w-full md:w-1/2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main Score Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center space-y-4 col-span-1 min-h-[300px]">
          <Skeleton className="h-36 w-36 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-white dark:bg-slate-900 col-span-2 space-y-5">
          <Skeleton className="h-5 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Skills list skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-white dark:bg-slate-900 space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-xl bg-white dark:bg-slate-900 space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Greetings */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-1/4" />
        <Skeleton className="h-4.5 w-1/3" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-white dark:bg-slate-900 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        ))}
      </div>

      {/* Grid of chart and list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 p-5 rounded-xl bg-white dark:bg-slate-900 space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 p-5 rounded-xl bg-white dark:bg-slate-900 space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div className="space-y-1.5 w-2/3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
