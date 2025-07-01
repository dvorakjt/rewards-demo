import path from "node:path";
import { watchFileOrDirectory } from "./watch-file-or-directory";
import { PartnerDefinitionFiles } from "../constants/partner-definition-files";
import { ChangeSetReaderWriter } from "../io/changeset-reader-writer";
import { PartnerReader } from "../io/partner-reader";
import { RewardReader } from "../io/reward-reader";

export class PartnerFilesWatcher {
  private readonly changeSetReaderWriter: ChangeSetReaderWriter;
  private readonly partnerReader: PartnerReader;
  private readonly rewardReader: RewardReader;

  constructor(
    pathToChangeSet: string,
    private readonly pathToPartnersDirectory: string,
    private readonly pathToRewardsDirectory: string
  ) {
    this.changeSetReaderWriter = new ChangeSetReaderWriter(pathToChangeSet);
    this.partnerReader = new PartnerReader(this.pathToPartnersDirectory);
    this.rewardReader = new RewardReader(this.pathToRewardsDirectory);
  }

  public watchPartnersDirectory() {
    watchFileOrDirectory(
      this.pathToPartnersDirectory,
      (_, sourcePath, destinationPath) => {
        if (sourcePath.startsWith(this.pathToPartnersDirectory)) {
          this.processPartner(sourcePath);
        }

        if (destinationPath.startsWith(this.pathToPartnersDirectory)) {
          this.processPartner(destinationPath);
        }
      }
    );
  }

  private processPartner(filepath: string) {
    const partnerId = this.extractPartnerIdFromFilePath(filepath);

    if (this.partnerReader.partnerHasRequiredData(partnerId)) {
      if (this.changeSetReaderWriter.hasPartner(partnerId)) {
        const modifiedFile = this.extractModifiedFileFromFilePath(filepath);
        this.updatePartnerInChangeSet(partnerId, modifiedFile);
      } else {
        this.createPartnerInChangeSet(partnerId);
      }
    } else {
      this.removePartnerFromChangeSet(partnerId);
    }
  }

  private extractPartnerIdFromFilePath(filepath: string) {
    const pathToPartnersDirectoryWithTrailingSeparator =
      this.pathToPartnersDirectory + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToPartnersDirectoryWithTrailingSeparator.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const partnerId = filepath.slice(
      pathToPartnersDirectoryWithTrailingSeparator.length,
      indexOfNextSeparator
    );

    return partnerId;
  }

  private extractModifiedFileFromFilePath(filepath: string) {
    return path.basename(filepath);
  }

  private updatePartnerInChangeSet(partnerId: string, modifiedFile: string) {
    switch (modifiedFile) {
      case PartnerDefinitionFiles.DataFile:
      case PartnerDefinitionFiles.DescriptionFile:
      case PartnerDefinitionFiles.Why8By8File:
        this.changeSetReaderWriter.updatePartnerLastModifiedAt(
          partnerId,
          new Date()
        );
        break;
      case PartnerDefinitionFiles.LocationsFile:
        this.changeSetReaderWriter.updatePartnerLocationsLastModifiedAt(
          partnerId,
          new Date()
        );
    }
  }

  private createPartnerInChangeSet(partnerId: string) {
    const now = new Date();
    this.changeSetReaderWriter.recordNewPartner(partnerId, now);
    const rewardIds = this.rewardReader.readPartnerRewardIds(partnerId);
    for (const rewardId of rewardIds) {
      if (this.rewardReader.rewardHasRequiredData(rewardId)) {
        this.changeSetReaderWriter.recordOrUpdateReward(
          partnerId,
          rewardId,
          now
        );
      }
    }
  }

  private removePartnerFromChangeSet(partnerId: string) {
    this.changeSetReaderWriter.removePartner(partnerId);
  }
}
