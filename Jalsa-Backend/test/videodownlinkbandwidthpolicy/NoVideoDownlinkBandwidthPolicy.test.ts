// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as chai from 'chai';

import LogLevel from '../../src/logger/LogLevel';
import NoOpLogger from '../../src/logger/NoOpLogger';
import NoVideoDownlinkBandwidthPolicy from '../../src/videodownlinkbandwidthpolicy/NoVideoDownlinkBandwidthPolicy';
import DefaultVideoStreamIndex from '../../src/videostreamindex/DefaultVideoStreamIndex';

describe('NoVideoDownlinkBandwidthPolicy', () => {
  const expect: Chai.ExpectStatic = chai.expect;
  const logger = new NoOpLogger(LogLevel.DEBUG);
  let policy: NoVideoDownlinkBandwidthPolicy;
  let emptyVideoStreamIndex: DefaultVideoStreamIndex;

  before(() => {
    policy = new NoVideoDownlinkBandwidthPolicy();
    emptyVideoStreamIndex = new DefaultVideoStreamIndex(logger);
  });

  describe('wantsResubscribe', () => {
    it('always returns false', () => {
      expect(policy.wantsResubscribe()).to.be.false;
      policy.updateIndex(emptyVideoStreamIndex);
      policy.updateCalculatedOptimalReceiveSet();
      expect(policy.wantsResubscribe()).to.be.false;
      policy.updateAvailableBandwidth(500);
      expect(policy.wantsResubscribe()).to.be.false;
    });
  });

  describe('chooseSubscriptions', () => {
    it('returns empty set', () => {
      expect(policy.wantsResubscribe()).to.be.false;
      policy.updateIndex(emptyVideoStreamIndex);
      policy.updateCalculatedOptimalReceiveSet();
      const idSet = policy.chooseSubscriptions();
      expect(idSet.array()).to.be.deep.equal([]);
    });
  });
});
