import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { createRoot } from 'react-dom/client';
import { RootLayout } from './root-layout';
import { Partners } from './pages/partners';
import { NewPartner } from './pages/partners/new-partner';
import { ViewPartner } from './pages/partners/view-partner';
import { EditPartner } from './pages/partners/edit-partner';
import { Rewards } from './pages/rewards';
import { NewReward } from './pages/rewards/new-reward';
import { ViewReward } from './pages/rewards/view-reward';
import { EditReward } from './pages/rewards/edit-reward';
import { Server } from './pages/server';
import { RecycleBin } from './pages/recycle-bin';
import { ViewRecycledItem } from './pages/recycle-bin/view-recycled-item';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/partners" replace />} />
          <Route path="partners">
            <Route index element={<Partners />} />
            <Route path="new" element={<NewPartner />} />
            <Route path=":partnerId">
              <Route index element={<ViewPartner />} />
              <Route path="edit" element={<EditPartner />} />
            </Route>
          </Route>
          <Route path="rewards">
            <Route index element={<Rewards />} />
            <Route path="new" element={<NewReward />} />
            <Route path=":rewardId">
              <Route index element={<ViewReward />} />
              <Route path="edit" element={<EditReward />} />
            </Route>
          </Route>
          <Route path="server" element={<Server />} />
          <Route path="recycle">
            <Route index element={<RecycleBin />} />
            <Route path=":itemId" element={<ViewRecycledItem />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
